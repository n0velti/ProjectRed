const getUserByID = `
query GetUserByID($userID: String!) {
    listUsers( filter: {
      userID: { 
        contains: $userID
      }
    }) {
      items {
        id
        userEmail
      }
    }
  }
`
export { getUserByID }