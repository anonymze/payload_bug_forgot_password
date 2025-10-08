import { Commission } from "@/payload-types";

const organizeCommissionsByMonth = (
  commissions: Omit<Commission, "app_user">[],
) => {
  const monthlyData: Record<
    string,
    {
      id: string;
      labelDate: string;
      commissions: Omit<Commission, "app_user">[];
      totalAmount: number;
      groupedData: {
        encours: number;
        production: number;
        structured_product: number;
      };
      comparison?: {
        difference: number;
        percentageChange: number;
        previousMonthTotal: number;
      };
    }
  > = {};

  let overallTotal = 0;

  // Process commissions (suppliers are already populated)
  commissions.forEach((commission) => {
    if (!commission.date) return;

    const date = new Date(commission.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const monthName = date.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        id: crypto.randomUUID(),
        labelDate: monthName,
        commissions: [],
        totalAmount: 0,
        groupedData: {
          encours: 0,
          production: 0,
          structured_product: 0,
        },
      };
    }

    monthlyData[monthKey].commissions.push(commission);

    // Calculate amounts
    const encours = 0;
    const production = 0;
    const upFront = 0;
    const total = encours + production + upFront;

    monthlyData[monthKey].totalAmount += total;
    monthlyData[monthKey].groupedData.encours += encours;
    monthlyData[monthKey].groupedData.production += production;
    monthlyData[monthKey].groupedData.structured_product += upFront;

    // Add to overall total
    overallTotal += total;
  });

  // Clean up Infinity values for months with no commissions and sort months chronologically
  const sortedMonths = Object.keys(monthlyData);

  sortedMonths.forEach((monthKey, index) => {
    const currentMonth = monthlyData[monthKey];

    const previousMonthKey = sortedMonths[index + 1];

    if (previousMonthKey) {
      const previousMonth = monthlyData[previousMonthKey];
      const difference = currentMonth.totalAmount - previousMonth.totalAmount;
      const percentageChange =
        previousMonth.totalAmount > 0
          ? (difference / previousMonth.totalAmount) * 100
          : 0;

      currentMonth.comparison = {
        difference,
        percentageChange,
        previousMonthTotal: previousMonth.totalAmount,
      };
    }
  });

  return {
    monthlyData: Object.values(monthlyData),
    total: overallTotal,
  };
};

const organizeCommissionsByYear = (
  commissions: Omit<Commission, "app_user">[],
) => {
  const yearlyData: Record<
    string,
    {
      id: string;
      labelDate: string;
      totalAmount: number;
      groupedData: {
        encours: number;
        production: number;
        structured_product: number;
      };
      comparison?: {
        difference: number;
        percentageChange: number;
        previousYearTotal: number;
      };
    }
  > = {};

  let overallTotal = 0;

  // Process commissions (suppliers are already populated)
  commissions.forEach((commission) => {
    if (!commission.date) return;

    const date = new Date(commission.date);
    const yearKey = date.getFullYear().toString();
    const yearName = date.toLocaleDateString("fr-FR", { year: "numeric" });

    if (!yearlyData[yearKey]) {
      yearlyData[yearKey] = {
        id: crypto.randomUUID(),
        labelDate: yearName,
        totalAmount: 0,
        groupedData: {
          encours: 0,
          production: 0,
          structured_product: 0,
        },
      };
    }

    // Calculate amounts
    const encours = 0;
    const production = 0;
    const upFront = 0;
    const total = encours + production + upFront;

    yearlyData[yearKey].totalAmount += total;
    yearlyData[yearKey].groupedData.encours += encours;
    yearlyData[yearKey].groupedData.production += production;
    yearlyData[yearKey].groupedData.structured_product += upFront;

    // Add to overall total
    overallTotal += total;
  });

  // Clean up Infinity values for years with no commissions and sort years chronologically
  const sortedYears = Object.keys(yearlyData);

  sortedYears.forEach((yearKey, index) => {
    const currentYear = yearlyData[yearKey];

    const previousYearKey = sortedYears[index + 1];

    if (previousYearKey) {
      const previousYear = yearlyData[previousYearKey];
      const difference = currentYear.totalAmount - previousYear.totalAmount;
      const percentageChange =
        previousYear.totalAmount > 0
          ? (difference / previousYear.totalAmount) * 100
          : 0;

      currentYear.comparison = {
        difference,
        percentageChange,
        previousYearTotal: previousYear.totalAmount,
      };
    }
  });

  return {
    yearlyData: Object.values(yearlyData),
    total: overallTotal,
  };
};

export { organizeCommissionsByMonth, organizeCommissionsByYear };
