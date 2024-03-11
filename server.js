// Description: Api pokemon
const dotenv = require("dotenv");
const morgan = require("morgan");
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const app = express();
dotenv.config();
const port = process.env.PORT;
const routes = require("./src/routes/pokemon");
const swaggerDocument = require("./src/config/documentation.json");

const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API Pokemon"
};

app.use(morgan("dev"));
app.use(express.json());

app.use('/api/pokemons', routes);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

app.use('/api/utilisateurs', require('./src/routes/utilisateurs'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




