## Build process

### Security 

For now you can't make someone an admin from the app, i added this road block so that an admin will only be created when NECESSARY, so much power comes with being an AD. 

`How i achieved this :`

 ```js
 const express = require("express")
 const Router = express.Router()

   Router.use(function(req,res,next){
    delete req.body.admin;
    next()
})

   ```
i added an express middleware to the to all post routes by agents,and that deletes the property admin from the body before carrying out the rest of the action. this way there is no way a user can tag on the agent property on their document during updates.

I am proud of this actually because it was an original thought. anohter way i could have done this was probably deleting the property for each route but you know what they say abiut programmers and repeating codes


Because agents (not original creators) will be employed to work
on this. these are some securities i put in place to protect the 
company from rogue employees

1. All docs posted by agents require an approval by an admin to go live for users
2. All edits of docs made by agents are not destructive as they still require approval from an admin to  take effect to [prevent cases like agents deleting/holding vital infos hostage]
3. Only post posted by agents can be edited by them.