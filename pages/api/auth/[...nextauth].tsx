import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi ,{ LOGIN_URL } from "../../../lib/spotify"
import { JWT } from "next-auth/jwt"


async function refreshAccessToken(token:JWT) {

      try {
        // @ts-ignore
        spotifyApi.setAccessToken(token.accessToken); 
        // @ts-ignore
        spotifyApi.setRefreshToken(token.refreshToken);
        const {body: refreshedToken} = await spotifyApi.refreshAccessToken();
        console.log('REFRESHED TOKEN IS', refreshedToken); 
        return {
            ...token, 
            accessToken:refreshedToken.access_token,
            accessTokenExpires:Date.now() + refreshedToken.expires_in * 1000 ,  // = 1 hour as spotify api returns 3600 
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken , // Fall back to old refresh token


        }
  } catch (error) {

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }

    
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [

    SpotifyProvider({
           // @ts-ignore
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID, 

           // @ts-ignore
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,

      authorization: LOGIN_URL,

    }),
    // ...add more providers here
  ],
  secret:process.env.JWT_SECRET,
  pages:{
        signIn: '/login'
  }, 
  callbacks: {
    async jwt({token, account, user}){
        // initial sign in 
        if(account && user){
            return {
                ...token, 
                accessToken:account.access_token,
                refreshToken:account.refresh_token,
                username:account.providerAccountId,
                // @ts-ignore
                accessTokenExpires: account.expires_at *1000  ,  // we are handling expiring time in Milliseconds hence * 1000 

            }

              // Return previous token if the access token has not expired yet
        

        }
        // @ts-ignore
        if (Date.now() < token.accessTokenExpires) {
             return token
      }

            // Access token has expired, try to update it

           return await refreshAccessToken(token)

    },
    // @ts-ignore
    async session({session, token}) {

   try { 
         //   @ts-ignore
      session.user.email = token.email;
    //   @ts-ignore
      session.user.name = token.name;

          //   @ts-ignore

      session.user.username = token.username;


        // @ts-ignore
      session.accessToken = token.accessToken ;
    
    //   @ts-ignore
      session.refreshToken = token.refreshToken;
        // @ts-ignore
      session.error = token.error

      return session
    } catch(error){
        // @ts-ignore
        console.log('THE ERROR IS '+ error.message)
      }
   },
  }, 

  
});

