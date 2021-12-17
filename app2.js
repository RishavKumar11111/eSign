var builder = require('xmlbuilder');
var SignedXml = require('xml-crypto').SignedXml;
var fse = require('fs-extra');

module.exports.SXML = function () {

    var dt = new Date().toISOString().replace(new RegExp('-', 'g'), '').replace(new RegExp(':', 'g'), '').replace(new RegExp('T', 'g'), '-').split('.')[0];

    //Created the request XML as per the required format
    var xml = builder.create('Esign')
        .att('ver', '2.1')
        .att('sc', 'Y')
        .att('ts', new Date().toISOString())
        .att('txn', '999-ODISHA-' + dt + '-000001')
        .att('ekycId', '')
        .att('ekycIdType', 'A')
        .att('aspId', 'TNIC-001')
        .att('AuthMode', '1')
        .att('responseSigType', 'pkcs7')
        .att('responseUrl', 'https://nic-esigngateway.nic.in/eSign21/response?rs=localhost:8080');

    xml.ele('Docs').ele('InputHash', { 'id': '1', 'hashAlgorithm': 'SHA256', 'docInfo': 'eSign' }, '5df2936623312f38371871bf5226e666c66318329d826bf7db544237096a837e');

    //XML doc is ready for signing. Converted to String 
    var xmldoc = xml.toString({ pretty: true });

    var sig = new SignedXml();
    sig.addReference('/*', ['http://www.w3.org/2000/09/xmldsig#enveloped-signature', 'http://www.w3.org/2001/10/xml-exc-c14n#'], 'http://www.w3.org/2000/09/xmldsig#sha1', '', '', '', true);

    sig.signingKey = fse.readFileSync('nicesign.pem');
    sig.canonicalizationAlgorithm = 'http://www.w3.org/2001/10/xml-exc-c14n#';
    sig.signatureAlgorithm = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1';
    sig.computeSignature(xmldoc);
    fse.writeFileSync("signed.xml", sig.getSignedXml())
    return sig.getSignedXml();
};