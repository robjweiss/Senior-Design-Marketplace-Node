// We first require our express package
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const configRoutes = require("./routes");
var SamlStrategy = require('passport-saml').Strategy;
const fs = require('fs');

// We create our express isntance:
const app = express();
const passport = require("passport");
const static = express.static(__dirname + "/public");
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");

passport.use(new SamlStrategy(
  {
    path: '/login/callback',
    entryPoint: 'https://shibboleth.stevens.edu/idp/profile/SAML2/Redirect/SSO',
    issuer: 'senior-design-marketplace',
    host: 'mallard.stevens.edu',
    identifierFormat: null,
    decryptionPvk: fs.readFileSync('./credentials/mykey.key', 'utf-8')
  },
  async function(profile, done) {
    return done(null,
      {
        profile: profile
      });
  })
);

// passport.serializeUser(function (user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function (user, done) {
//   done(null, user);
// });

// app.get('/metadata',
//   function(req, res) {
//     const decryptionCert = fs.readFileSync('./credentials/certificate.crt', 'utf-8');
//     res.type('application/xml');
//     res.send((new SamlStrategy(
//       {
//         path: '/login/callback',
//         entryPoint: 'https://shibboleth.stevens.edu/idp/profile/SAML2/Redirect/SSO',
//         issuer: 'senior-design-marketplace',
//         host: 'mallard.stevens.edu:3000',
//         decryptionPvk: fs.readFileSync('./credentials/mykey.key', 'utf-8'),
//       },
//       function(profile, done) {
//         findByEmail(profile.email, function(err, user) {
//           if (err) {
//             return done(err);
//           }
//           return done(null, user);
//         });
//       }).generateServiceProviderMetadata(decryptionCert)));
//   }
// );

const handlebarsInstance = exphbs.create({
  defaultLayout: "main",
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === "number")
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    }
  }
});

Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});

Handlebars.registerHelper("money", function(value, options)
{
    return "$" + parseFloat(value).toFixed(2) + "";
});

Handlebars.registerHelper("ifEqual", function(arg1, arg2, options) {
    if (arg1 > arg2) {
      return true;
    } else {
      return false;
    }
});

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    // If the user posts to the server with a property called _method, rewrite the request's method
    // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
    // rewritten in this middleware to a PUT route
    if (req.body && req.body._method) {
      req.method = req.body._method;
      delete req.body._method;
    }
  
    // let the next middleware run:
    next();
  };

app.use("/public", static);
app.use(cookieParser());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

configRoutes(app);

// We can now navigate to localhost:5000
app.listen(5000, function () {
    console.log("Your server is now listening on port 3000! Navigate to http://localhost:5000 to access it");
});