import { sendEmail } from "@/emails/email";
import { PayloadRequest } from "payload";
import * as XLSX from "xlsx";
import {
  organizeCommissionsByMonth,
  organizeCommissionsByYear,
} from "./commission";
import { z } from "zod";

const endpointsCommission = {
  formatedData: {
    method: "get" as const,
    path: "/extra/:userId",
    handler: async (req: PayloadRequest) => {
      const { userId } = req.routeParams as { userId: string };

      if (!userId) {
        return Response.json(
          {
            message: "KO",
          },
          {
            status: 500,
          },
        );
      }

      const commissions = await req.payload.find({
        collection: "commissions",
        sort: "-informations.date",
        select: {
          app_user: false,
        },
        depth: 2,
        limit: 0,
        where: {
          app_user: {
            equals: userId,
          },
        },
      });

      // Organize commissions by month with already populated suppliers
      const { monthlyData, total } = organizeCommissionsByMonth(
        commissions.docs,
      );
      const { yearlyData, total: yearlyTotal } = organizeCommissionsByYear(
        commissions.docs,
      );

      return Response.json({
        monthlyData,
        yearlyData,
        totalAmountMonth: total,
        totalAmountYear: yearlyTotal,
      });
    },
  },
  export: {
    method: "get" as const,
    path: "/export/:commissionId",
    handler: async (req: PayloadRequest) => {
      const { commissionId } = req.routeParams as { commissionId: string };
      const email = req.searchParams.get("email");

      if (!commissionId) {
        return Response.json(
          {
            message: "KO",
          },
          {
            status: 500,
          },
        );
      }

      const commission = await req.payload.findByID({
        collection: "commissions",
        id: commissionId,
        depth: 2,
      });

      if (!commission) {
        return Response.json(
          {
            message: "Commission not found",
          },
          {
            status: 404,
          },
        );
      }

      // Create Excel workbook
      const workbook = XLSX.utils.book_new();

      // Prepare data for Excel
      let totalEncours = 0;
      let totalProduction = 0;

      const userName =
        typeof commission.app_user === "string"
          ? "utilisateur"
          : commission.app_user?.lastname;

      // Process commission suppliers - create one sheet per supplier
      if (
        commission.commission_suppliers &&
        commission.commission_suppliers.length > 0
      ) {
        commission.commission_suppliers.forEach((cs) => {
          if (typeof cs === "string" || typeof cs.supplier === "string") return;

          const supplier = cs.supplier.name;
          const encours = cs.encours || 0;
          const production = cs.production || 0;

          // Create data for this supplier's sheet
          const supplierData = [];

          // Add headers and supplier totals at the top
          supplierData.push(["", "Production", "Encours"]);
          supplierData.push(["Total", production, encours]);

          // Add empty row after totals
          supplierData.push([]);

          // Add sheet_lines data for this supplier
          if (cs.sheet_lines && Array.isArray(cs.sheet_lines)) {
            cs.sheet_lines.forEach((line) => {
              if (Array.isArray(line)) {
                supplierData.push(line);
              }
            });
          }

          // Create worksheet for this supplier
          const worksheet = XLSX.utils.aoa_to_sheet(supplierData);

          // Add worksheet to workbook with supplier name
          XLSX.utils.book_append_sheet(workbook, worksheet, supplier);

          totalEncours += encours;
          totalProduction += production;
        });
      }

      // Create a summary sheet with overall totals
      const summaryData = [
        ["", "Production", "Encours"],
        ["TOTAL GÉNÉRAL", totalProduction, totalEncours],
      ];
      const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Général");

      // Generate Excel buffer
      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

      // Check if email is provided
      if (email) {
        // Send Excel file via email
        const dateStr = new Date(commission.date).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        });

        const filename = `${userName}_${dateStr.replace(/\//g, "-")}_commission.xlsx`;

        await sendEmail({
          to: email,
          subject: `Export commission - Groupe Valorem - ${dateStr}`,
          text: `Veuillez trouver en pièce jointe l'export de commission pour la date du ${dateStr}`,
          html: `
            <h2>Export commission - Groupe Valorem</h2>
            <p>Veuillez trouver en pièce jointe l'export de commission pour la date du ${dateStr}</p>
          `,
          attachments: [
            {
              filename: filename,
              content: buffer,
              contentType:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
          ],
        });

        return Response.json({
          message: "Export de commission envoyé avec succès à " + email,
          success: true,
        });
      } else {
        // Return Excel file directly
        const dateStr = new Date(commission.date).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        });

        const filename = `${userName}_${dateStr.replace(/\//g, "-")}_commission.xlsx`;

        return new Response(buffer, {
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${filename}"`,
          },
        });
      }
    },
  },
  createCommissionWithCommissionSuppliers: {
    method: "post" as const,
    path: "/commission-suppliers",
    handler: async (req: PayloadRequest) => {
      const data = (await req.json?.()) as {
        app_user: string;
        date: string;
        commission_supplier_ids: string[];
      } | null;

      if (
        !data ||
        !data?.commission_supplier_ids?.length ||
        !data.app_user ||
        !data.date
      ) {
        return Response.json(
          {
            message: "KO",
          },
          {
            status: 500,
          },
        );
      }

      await req.payload.create({
        collection: "commissions",
        data: {
          app_user: data.app_user,
          date: data.date,
          commission_suppliers: data.commission_supplier_ids,
        },
      });

      return Response.json(
        { success: true },
        {
          status: 201,
        },
      );
    },
  },
};

export { endpointsCommission };
