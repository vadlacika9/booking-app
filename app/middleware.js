import { withAuth } from "next-auth/middleware"

export default withAuth({
  // Oldalak, amikhez autentikáció szükséges
  callbacks: {
    authorized: ({ token }) => !!token,
  },
})

// Csak ezekre az útvonalakra vonatkozik
export const config = {
  matcher: [
    "/account",
    "/add-service"
  ],
}
