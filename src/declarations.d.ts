/*
  Declaration files are how the Typescript compiler knows about the type information(or shape) of an object.
  They're what make intellisense work and make Typescript know all about your code.
  A wildcard module is declared below to allow third party libraries to be used in an app even if they don't
  provide their own type declarations.
  To learn more about using third party libraries in an Ionic app, check out the docs here:
  http://ionicframework.com/docs/v2/resources/third-party-libs/
  For more info on type definition files, check out the Typescript docs here:
  https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html
*/
declare module '*';
type User = {
   email: string,
   email_verified: boolean,
   given_name: string,
   family_name: string,
   user_metadata: {
      medical_school: string,
      graduation_year: string
   },
   updated_at: string,
   name: string,
   picture: string,
   user_id: string,
   nickname: string,
   identities: [
    {
         user_id: string,
         provider: string,
         connection: string,
         isSocial: boolean
      }
   ],
   created_at: string,
   last_login: string,
   logins_count: number,
   app_metadata: {
      firebase_token: string,
      roles: string []
   }
}
