import '@/styles/app.css';

import React from 'react';


export const metadata = {
  description: 'Simply Life',
  title: 'Simply Life',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
