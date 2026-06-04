/// <reference path="./src/types/express.d.ts" />
import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import useragent from 'express-useragent';
import * as i18nMiddleware from 'i18next-http-middleware';

import envVariables from './src/config/envVariables';
import i18n from './src/config/i18n';
import routes from './src/routes/routes';
import connectDB from './src/config/dbConfig';

const app = express();

connectDB();

app.set("trust proxy", true);
app.use(cors());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/"
}));
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(useragent.express());
app.use(i18nMiddleware.handle(i18n));

app.use('/api',routes);


app.listen(envVariables.PORT, () => {
  console.log(`Your app (${envVariables.APP_NAME}) has been started on port ${envVariables.PORT}.URL http://localhost:${envVariables.PORT}`)
})