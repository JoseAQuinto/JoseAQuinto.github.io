const express = require("express");
const { generarInformePdf } = require("../controllers/pdf.controller");

const router = express.Router();

router.post("/informe", generarInformePdf);

module.exports = router;