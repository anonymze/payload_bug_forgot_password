import { UIFieldServerComponent, UIFieldServerProps } from 'payload'
import { app_users, agency_life_status } from '@/payload-generated-schema'
import { eq } from '@payloadcms/db-vercel-postgres/drizzle';

const CustomServerButton: UIFieldServerComponent = async (props: UIFieldServerProps) => {
  const { id, payload } = props;

  if (!id) {
    return <div>Pas d'ID d'événement</div>
  }

  // Récupérer tous les utilisateurs avec leur statut pour cet événement (LEFT JOIN)
  const usersWithStatus = await payload.db.drizzle
    .select({
      userId: app_users.id,
      email: app_users.email,
      firstname: app_users.firstname,
      lastname: app_users.lastname,
      status: agency_life_status.status
    })
    .from(app_users)
    .leftJoin(
      agency_life_status,
      eq(
        agency_life_status.app_user,
        app_users.id
      ) && eq(
        agency_life_status.agency_life,
        id.toString()
      )
    );

  // Compter les statuts
  const statusCounts = usersWithStatus.reduce((acc, user) => {
    const status = user.status || 'waiting';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <h3>Accepté : <span style={{ color: 'green'}}>{statusCounts.yes || 0}</span></h3>
      <h3>Refusé : <span style={{ color: 'red'}}>{statusCounts.no || 0}</span></h3>
      <h3>En attente : <span style={{ color: 'gray'}}>{statusCounts.waiting || 0}</span></h3>

      <details style={{ marginTop: '20px' }}>
        <summary>Utilisateurs ({usersWithStatus.length})</summary>
        <div style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '10px' }}>
          {usersWithStatus.map((user) => (
            <div key={user.userId} style={{
              padding: '5px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>
                {user.firstname} {user.lastname} ({user.email})
              </span>
              <span style={{
                color: user.status === 'yes' ? 'green' :
                       user.status === 'no' ? 'red' : 'gray',
                fontWeight: 'bold'
              }}>
                {user.status === 'yes' ? '✅' :
                 user.status === 'no' ? '❌' : '⏳'}
              </span>
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}

export default CustomServerButton
