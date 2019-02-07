// We first require our express package
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const configRoutes = require("./routes");
var SamlStrategy = require('passport-saml').Strategy;

// We create our express isntance:
const app = express();
// const passport = passport();
const static = express.static(__dirname + "/public");
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");

// passport.use(new SamlStrategy(
//   {
//     path: '/login',
//     entryPoint: 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
//     issuer: 'passport-saml'
//   },
//   function(profile, done) {
//     findByEmail(profile.email, function(err, user) {
//       if (err) {
//         return done(err);
//       }
//       return done(null, user);
//     });
//   })
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

// We can now navigate to localhost:3000
app.listen(3000, function () {
    console.log("Your server is now listening on port 3000! Navigate to http://localhost:3000 to access it");
    if (process && process.send) process.send({ done: true }); // ADD THIS LINE
});