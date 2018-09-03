
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//---------------- ADD YOUR BUISNESS EMAIL TO SEND MAIL INSTEAD ---------------------
//---------------------------------- OF ---------------------------------------------
//----------------------------"example.com"------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------

import * as path from 'path';
var smail = require('nodemailer');

export class SendMail {
    /**
    * Refferal Request
    * @param {*object} obj 
    * @param {*function} cb 
    */
    static forgetPassword = function (obj, cb) {

        var smtptransport = smail.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'ttttester102@gmail.com',
                pass: '872909066'
            }
        });

        var options = {
            from: 'TestChat<example.com>',
            to: obj.email,
            subject: 'LAWYERUP',
            html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>[SUBJECT]</title>
        <style type="text/css">
            body {
                padding-top: 0 !important;
                padding-bottom: 0 !important;
                padding-top: 0 !important;
                padding-bottom: 0 !important;
                margin:0 !important;
                width: 100% !important;
                -webkit-text-size-adjust: 100% !important;
                -ms-text-size-adjust: 100% !important;
                -webkit-font-smoothing: antialiased !important;
            }
            .tableContent img {
                border: 0 !important;
                display: block !important;
                outline: none !important;
            }

            p, h2{
                margin:0;
            }

            div,p,ul,h2,h2{
                margin:0;
            }

            h2.bigger,h2.bigger{
                font-size: 32px;
                font-weight: normal;
            }

            h2.big,h2.big{
                font-size: 21px;
                font-weight: normal;
            }

            a.link1{
                color:#62A9D2;font-size:13px;font-weight:bold;text-decoration:none;
            }

            a.link2{
                padding:8px;background:#62A9D2;font-size:13px;color:#ffffff;text-decoration:none;font-weight:bold;
            }

            a.link3{
                background:#62A9D2; color:#ffffff; padding:8px 10px;text-decoration:none;font-size:13px;
            }
            .bgBody{
                background: #F6F6F6;
            }
            .bgItem{
                background: #ffffff;
            }

            @media only screen and (max-width:480px)

            {

                table[class="MainContainer"], td[class="cell"] 
                {
                    width: 100% !important;
                    height:auto !important; 
                }
                td[class="specbundle"] 
                {
                    width: 100% !important;
                    float:left !important;
                    font-size:13px !important;
                    line-height:17px !important;
                    display:block !important;

                }
                td[class="specbundle1"] 
                {
                    width: 100% !important;
                    float:left !important;
                    font-size:13px !important;
                    line-height:17px !important;
                    display:block !important;
                    padding-bottom:20px !important;

                }	
                td[class="specbundle2"] 
                {
                    width:90% !important;
                    float:left !important;
                    font-size:14px !important;
                    line-height:18px !important;
                    display:block !important;
                    padding-left:5% !important;
                    padding-right:5% !important;
                }
                td[class="specbundle3"] 
                {
                    width:90% !important;
                    float:left !important;
                    font-size:14px !important;
                    line-height:18px !important;
                    display:block !important;
                    padding-left:5% !important;
                    padding-right:5% !important;
                    padding-bottom:20px !important;
                    text-align:center !important;
                }
                td[class="specbundle4"] 
                {
                    width: 100% !important;
                    float:left !important;
                    font-size:13px !important;
                    line-height:17px !important;
                    display:block !important;
                    padding-bottom:20px !important;
                    text-align:center !important;

                }

                td[class="spechide"] 
                {
                    display:none !important;
                }
                img[class="banner"] 
                {
                    width: 100% !important;
                    height: auto !important;
                }
                td[class="left_pad"] 
                {
                    padding-left:15px !important;
                    padding-right:15px !important;
                }

            }

            @media only screen and (max-width:540px) 

            {

                table[class="MainContainer"], td[class="cell"] 
                {
                    width: 100% !important;
                    height:auto !important; 
                }
                td[class="specbundle"] 
                {
                    width: 100% !important;
                    float:left !important;
                    font-size:13px !important;
                    line-height:17px !important;
                    display:block !important;

                }
                td[class="specbundle1"] 
                {
                    width: 100% !important;
                    float:left !important;
                    font-size:13px !important;
                    line-height:17px !important;
                    display:block !important;
                    padding-bottom:20px !important;

                }		
                td[class="specbundle2"] 
                {
                    width:90% !important;
                    float:left !important;
                    font-size:14px !important;
                    line-height:18px !important;
                    display:block !important;
                    padding-left:5% !important;
                    padding-right:5% !important;
                }
                td[class="specbundle3"] 
                {
                    width:90% !important;
                    float:left !important;
                    font-size:14px !important;
                    line-height:18px !important;
                    display:block !important;
                    padding-left:5% !important;
                    padding-right:5% !important;
                    padding-bottom:20px !important;
                    text-align:center !important;
                }
                td[class="specbundle4"] 
                {
                    width: 100% !important;
                    float:left !important;
                    font-size:13px !important;
                    line-height:17px !important;
                    display:block !important;
                    padding-bottom:20px !important;
                    text-align:center !important;

                }

            }


        </style>
        <script type="colorScheme" class="swatch active">
            {
            "name":"Default",
            "bgBody":"F6F6F6",
            "link":"62A9D2",
            "color":"999999",
            "bgItem":"ffffff",
            "title":"555555"
            }
        </script>

    </head>
    <body paddingwidth="0" paddingheight="0"   style="padding-top: 0; padding-bottom: 0; padding-top: 0; padding-bottom: 0; background-repeat: repeat; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased;" offset="0" toppadding="0" leftpadding="0" style="margin-left:5px; margin-right:5px; margin-top:0px; margin-bottom:0px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="tableContent bgBody" align="center"  style='font-family:helvetica, sans-serif;'>
            <!--  =========================== The header ===========================  -->
            <tbody>
                <tr>
                    <td height='25' bgcolor='#F6F6F6' colspan='3'></td>
                </tr>
                <tr>
                    <td><table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr>
                                    <td valign="top" class="spechide"><table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tbody>
                                                <tr>
                                                    <td height='130' bgcolor='#F6F6F6'>&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td>&nbsp;</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td valign="top" width="600"><table width="600" border="0" cellspacing="0" cellpadding="0" align="center" class="MainContainer" bgcolor="#ffffff">
                                            <tbody>
                                                <!--  =========================== The body ===========================  -->   
                                                <tr>
                                                    <td class='movableContentContainer'>
                                                        <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                                                <tr>
                                                                    <td bgcolor='#ffb035' valign='top'>
                                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                                                            <tr>
                                                                                <td align='center' valign='middle' >
                                                                                    <div class="contentEditableContainer contentImageEditable">
                                                                                        <div class="contentEditable" >
                                                                                            <img src="http://34.223.229.37/imgs/icon.png" alt='Compagnie logo' data-default="placeholder" data-max-width="100" width='100'/>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                        <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                                                <tr><td height='25' bgcolor='#ffffff'></td></tr>

                                                                <tr><td height='5' bgcolor='#ffffff'></td></tr>

                                                                <tr><td height=12' bgcolor="#ffffff"></td></tr>
                                                                <tr><td height=20' bgcolor="#fff"></td></tr>
                                                            </table>
                                                        </div>
                                                        <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                                            <table valign="top" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="spechide" width="16">&nbsp;</td>
                                                                        <td class="specbundle2" width="568">
                                                                            <table valign="top" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
                                                                                <tbody>

                                                                                    <tr>
                                                                                        <td valign="top" align="left">
                                                                                            <div class="contentEditableContainer contentTextEditable">
                                                                                                <div class="contentEditable" style="color:#565656;font-size:15px;line-height:28px; font-weight: normal; border-left: 4px solid #724089; padding: 0 15px;">
                                                                                                    <p>Oops! Seems like you’ve forgotten your password. Please find the login password below</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr><td height="20">&nbsp;</td></tr>

                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                        <td class="spechide" width="16">&nbsp;</td>
                                                                    </tr>
                                                                    <tr><td colspan="3" height="16">&nbsp;</td></tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                      
                                                        <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top' style="background:#724089;" >

                                                                <tr><td height='28'></td></tr>

                                                                <tr>
                                                                    <td valign='top' align='center'>
                                                                        <div class="contentEditableContainer contentTextEditable">
                                                                            <div class="contentEditable" style="font-size:18px; padding: 6px 0; line-height: 16px;">
                                                                                <span style="color:#fff; font-size: 18px; margin:10px 0px; padding-right: 10px; float: left; text-align: right; width: 46%;">User Name/Email  :</span>
                                                                                <span style="color:#eee; font-size: 18px; margin:10px 0px;  padding-left: 10px;  float: left; text-align: left; width: 46%;">${obj.email}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="contentEditableContainer contentTextEditable">
                                                                            <div class="contentEditable" style="font-size:18px; padding: 6px 0; line-height: 16px; margin-top: 20px">
                                                                                <span style="color:#fff; font-size:18px; margin:10px 0px;   padding-right: 10px;  float: left; width: 46%; text-align: right; ">OTP  :</span>
                                                                                <span style="color:#eee; font-size:18px; margin:10px 0px; padding-left: 10px; float: left; width: 46%; text-align: left; ">${obj.password}</span>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>

                                                                <tr><td height='28'></td></tr>
                                                            </table>
                                                        </div>

                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td valign="top" class="spechide"><table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tbody>
                                                <tr>
                                                    <td height='130' bgcolor='#F6F6F6'>&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td>&nbsp;</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>      
    </body>
</html>
        `
        }
        smtptransport.sendMail(options, function (err, data) {
            if (err) {
                console.log(err);
                cb('err', err);
            }
            if (data) {
                console.log(data);
                cb('sent', data);
            }
        });
    }


    /**
        * Signup success mail
        * @param {*object} obj 
        * @param {*function} cb 
        */
    static signupSuccess = function (obj, cb) {

        var smtptransport = smail.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'tt7873441@gmail.com',
                pass: 'welcome2india'
            }
        });

        var options = {
            from: 'LAWYERUP<example.com>',
            to: obj.email,
            subject: 'LAWYERUP',
            html: `

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>[SUBJECT]</title>
        <style type="text/css">
            body {
                padding-top: 0 !important;
                padding-bottom: 0 !important;
                padding-top: 0 !important;
                padding-bottom: 0 !important;
                margin:0 !important;
                width: 100% !important;
                -webkit-text-size-adjust: 100% !important;
                -ms-text-size-adjust: 100% !important;
                -webkit-font-smoothing: antialiased !important;
            }
            .tableContent img {
                border: 0 !important;
                display: block !important;
                outline: none !important;
            }

            p, h2{
                margin:0;
            }

            div,p,ul,h2,h2{
                margin:0;
            }

            h2.bigger,h2.bigger{
                font-size: 32px;
                font-weight: normal;
            }

            h2.big,h2.big{
                font-size: 21px;
                font-weight: normal;
            }

            a.link1{
                color:#62A9D2;font-size:13px;font-weight:bold;text-decoration:none;
            }

            a.link2{
                padding:8px;background:#62A9D2;font-size:13px;color:#ffffff;text-decoration:none;font-weight:bold;
            }

            a.link3{
                background:#62A9D2; color:#ffffff; padding:8px 10px;text-decoration:none;font-size:13px;
            }
            .bgBody{
                background: #F6F6F6;
            }
            .bgItem{
                background: #ffffff;
            }

            @media only screen and (max-width:480px)

            {

                table[class="MainContainer"], td[class="cell"] 
                {
                    width: 100% !important;
                    height:auto !important; 
                }
                td[class="specbundle"] 
                {
                    width: 100% !important;
                    float:left !important;
                    font-size:13px !important;
                    line-height:17px !important;
                    display:block !important;

                }
                td[class="specbundle1"] 
                {
                    width: 100% !important;
                    float:left !important;
                    font-size:13px !important;
                    line-height:17px !important;
                    display:block !important;
                    padding-bottom:20px !important;

                }	
                td[class="specbundle2"] 
                {
                    width:90% !important;
                    float:left !important;
                    font-size:14px !important;
                    line-height:18px !important;
                    display:block !important;
                    padding-left:5% !important;
                    padding-right:5% !important;
                }
                td[class="specbundle3"] 
                {
                    width:90% !important;
                    float:left !important;
                    font-size:14px !important;
                    line-height:18px !important;
                    display:block !important;
                    padding-left:5% !important;
                    padding-right:5% !important;
                    padding-bottom:20px !important;
                    text-align:center !important;
                }
                td[class="specbundle4"] 
                {
                    width: 100% !important;
                    float:left !important;
                    font-size:13px !important;
                    line-height:17px !important;
                    display:block !important;
                    padding-bottom:20px !important;
                    text-align:center !important;

                }

                td[class="spechide"] 
                {
                    display:none !important;
                }
                img[class="banner"] 
                {
                    width: 100% !important;
                    height: auto !important;
                }
                td[class="left_pad"] 
                {
                    padding-left:15px !important;
                    padding-right:15px !important;
                }

            }

            @media only screen and (max-width:540px) 

            {

                table[class="MainContainer"], td[class="cell"] 
                {
                    width: 100% !important;
                    height:auto !important; 
                }
                td[class="specbundle"] 
                {
                    width: 100% !important;
                    float:left !important;
                    font-size:13px !important;
                    line-height:17px !important;
                    display:block !important;

                }
                td[class="specbundle1"] 
                {
                    width: 100% !important;
                    float:left !important;
                    font-size:13px !important;
                    line-height:17px !important;
                    display:block !important;
                    padding-bottom:20px !important;

                }		
                td[class="specbundle2"] 
                {
                    width:90% !important;
                    float:left !important;
                    font-size:14px !important;
                    line-height:18px !important;
                    display:block !important;
                    padding-left:5% !important;
                    padding-right:5% !important;
                }
                td[class="specbundle3"] 
                {
                    width:90% !important;
                    float:left !important;
                    font-size:14px !important;
                    line-height:18px !important;
                    display:block !important;
                    padding-left:5% !important;
                    padding-right:5% !important;
                    padding-bottom:20px !important;
                    text-align:center !important;
                }
                td[class="specbundle4"] 
                {
                    width: 100% !important;
                    float:left !important;
                    font-size:13px !important;
                    line-height:17px !important;
                    display:block !important;
                    padding-bottom:20px !important;
                    text-align:center !important;

                }

            }


        </style>
        <script type="colorScheme" class="swatch active">
            {
            "name":"Default",
            "bgBody":"F6F6F6",
            "link":"62A9D2",
            "color":"999999",
            "bgItem":"ffffff",
            "title":"555555"
            }
        </script>

    </head>
    <body paddingwidth="0" paddingheight="0"   style="padding-top: 0; padding-bottom: 0; padding-top: 0; padding-bottom: 0; background-repeat: repeat; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased;" offset="0" toppadding="0" leftpadding="0" style="margin-left:5px; margin-right:5px; margin-top:0px; margin-bottom:0px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="tableContent bgBody" align="center"  style='font-family:helvetica, sans-serif;'>
            <!--  =========================== The header ===========================  -->
            <tbody>
                <tr>
                    <td height='25' bgcolor='#F6F6F6' colspan='3'></td>
                </tr>
                <tr>
                    <td><table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr>
                                    <td valign="top" class="spechide"><table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tbody>
                                                <tr>
                                                    <td height='130' bgcolor='#F6F6F6'>&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td>&nbsp;</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td valign="top" width="600"><table width="600" border="0" cellspacing="0" cellpadding="0" align="center" class="MainContainer" bgcolor="#ffffff">
                                            <tbody>
                                                <!--  =========================== The body ===========================  -->   
                                                <tr>
                                                    <td class='movableContentContainer'>
                                                        <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                                                <tr>
                                                                    <td bgcolor='#ffb035' valign='top'>
                                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                                                            <tr>
                                                                                <td align='center' valign='middle' >
                                                                                    <div class="contentEditableContainer contentImageEditable">
                                                                                        <div class="contentEditable" >
                                                                                            <img src="http://34.223.229.37/imgs/icon.png" alt='Compagnie logo' data-default="placeholder" data-max-width="100" width='100'/>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                        <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                                                <tr><td height='25' bgcolor='#ffffff'></td></tr>

                                                                <tr><td height='5' bgcolor='#ffffff'></td></tr>

                                                                <tr><td height=12' bgcolor="#ffffff"></td></tr>
                                                                <tr><td height=20' bgcolor="#fff"></td></tr>
                                                            </table>
                                                        </div>
                                                        <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                                            <table valign="top" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="spechide" width="16">&nbsp;</td>
                                                                        <td class="specbundle2" width="568">
                                                                            <table valign="top" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
                                                                                <tbody>

                                                                                    <tr>
                                                                                        <td valign="top" align="left">
                                                                                            <div class="contentEditableContainer contentTextEditable">
                                                                                                <div class="contentEditable" style="color:#565656;font-size:15px;line-height:28px; font-weight: normal; border-left: 4px solid #724089; padding: 0 15px;">
                                                                                                    <p>Congratulations registeration has been successfully done!...</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr><td height="20">&nbsp;</td></tr>

                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                        <td class="spechide" width="16">&nbsp;</td>
                                                                    </tr>
                                                                    <tr><td colspan="3" height="16">&nbsp;</td></tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                      
                                                        <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top' style="background:#724089;" >

                                                                <tr><td height='28'></td></tr>

                                                                <tr>
                                                                    <td valign='top' align='center'>
                                                                        <div class="contentEditableContainer contentTextEditable">
                                                                            <div class="contentEditable" style="font-size:18px; padding: 6px 0; line-height: 16px;">
                                                                                <span style="color:#fff; font-size: 18px; margin:10px 0px; padding-right: 10px; float: left; text-align: right; width: 46%;">User Name/Email  :</span>
                                                                                <span style="color:#eee; font-size: 18px; margin:10px 0px;  padding-left: 10px;  float: left; text-align: left; width: 46%;">${obj.email}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="contentEditableContainer contentTextEditable">
                                                                            <div class="contentEditable" style="font-size:18px; padding: 6px 0; line-height: 16px; margin-top: 20px">
                                                                                <span style="color:#fff; font-size:18px; margin:10px 0px;   padding-right: 10px;  float: left; width: 46%; text-align: right; ">OTP  :</span>
                                                                                <span style="color:#eee; font-size:18px; margin:10px 0px; padding-left: 10px; float: left; width: 46%; text-align: left; ">${obj.token}</span>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>

                                                                <tr><td height='28'></td></tr>
                                                            </table>
                                                        </div>

                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td valign="top" class="spechide"><table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tbody>
                                                <tr>
                                                    <td height='130' bgcolor='#F6F6F6'>&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td>&nbsp;</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>      
    </body>
</html>

        `
        }
        smtptransport.sendMail(options, function (err, data) {
            if (err) {
                console.log('err', err);
                cb('err', err);
            }
            if (data) {
                console.log('data', data);
                cb('sent', data);
            }
        });
    }

    /**
        * Email verification
        * @param {*object} obj 
        * @param {*function} cb 
        */
    static emailVerificationWhileChanginEmail = function (obj, cb) {

        var smtptransport = smail.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'tt7873441@gmail.com',
                pass: 'welcome2india'
            }
        });

        var options = {
            from: 'LAWYERUP<example.com>',
            to: obj.email,
            subject: 'LAWYERUP',
            html: `

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>[SUBJECT]</title>
        <style type="text/css">
            body {
                padding-top: 0 !important;
                padding-bottom: 0 !important;
                padding-top: 0 !important;
                padding-bottom: 0 !important;
                margin:0 !important;
                width: 100% !important;
                -webkit-text-size-adjust: 100% !important;
                -ms-text-size-adjust: 100% !important;
                -webkit-font-smoothing: antialiased !important;
            }
            .tableContent img {
                border: 0 !important;
                display: block !important;
                outline: none !important;
            }

            p, h2{
                margin:0;
            }

            div,p,ul,h2,h2{
                margin:0;
            }

            h2.bigger,h2.bigger{
                font-size: 32px;
                font-weight: normal;
            }

            h2.big,h2.big{
                font-size: 21px;
                font-weight: normal;
            }

            a.link1{
                color:#62A9D2;font-size:13px;font-weight:bold;text-decoration:none;
            }

            a.link2{
                padding:8px;background:#62A9D2;font-size:13px;color:#ffffff;text-decoration:none;font-weight:bold;
            }

            a.link3{
                background:#62A9D2; color:#ffffff; padding:8px 10px;text-decoration:none;font-size:13px;
            }
            .bgBody{
                background: #F6F6F6;
            }
            .bgItem{
                background: #ffffff;
            }

            @media only screen and (max-width:480px)

            {

                table[class="MainContainer"], td[class="cell"] 
                {
                    width: 100% !important;
                    height:auto !important; 
                }
                td[class="specbundle"] 
                {
                    width: 100% !important;
                    float:left !important;
                    font-size:13px !important;
                    line-height:17px !important;
                    display:block !important;

                }
                td[class="specbundle1"] 
                {
                    width: 100% !important;
                    float:left !important;
                    font-size:13px !important;
                    line-height:17px !important;
                    display:block !important;
                    padding-bottom:20px !important;

                }	
                td[class="specbundle2"] 
                {
                    width:90% !important;
                    float:left !important;
                    font-size:14px !important;
                    line-height:18px !important;
                    display:block !important;
                    padding-left:5% !important;
                    padding-right:5% !important;
                }
                td[class="specbundle3"] 
                {
                    width:90% !important;
                    float:left !important;
                    font-size:14px !important;
                    line-height:18px !important;
                    display:block !important;
                    padding-left:5% !important;
                    padding-right:5% !important;
                    padding-bottom:20px !important;
                    text-align:center !important;
                }
                td[class="specbundle4"] 
                {
                    width: 100% !important;
                    float:left !important;
                    font-size:13px !important;
                    line-height:17px !important;
                    display:block !important;
                    padding-bottom:20px !important;
                    text-align:center !important;

                }

                td[class="spechide"] 
                {
                    display:none !important;
                }
                img[class="banner"] 
                {
                    width: 100% !important;
                    height: auto !important;
                }
                td[class="left_pad"] 
                {
                    padding-left:15px !important;
                    padding-right:15px !important;
                }

            }

            @media only screen and (max-width:540px) 

            {

                table[class="MainContainer"], td[class="cell"] 
                {
                    width: 100% !important;
                    height:auto !important; 
                }
                td[class="specbundle"] 
                {
                    width: 100% !important;
                    float:left !important;
                    font-size:13px !important;
                    line-height:17px !important;
                    display:block !important;

                }
                td[class="specbundle1"] 
                {
                    width: 100% !important;
                    float:left !important;
                    font-size:13px !important;
                    line-height:17px !important;
                    display:block !important;
                    padding-bottom:20px !important;

                }		
                td[class="specbundle2"] 
                {
                    width:90% !important;
                    float:left !important;
                    font-size:14px !important;
                    line-height:18px !important;
                    display:block !important;
                    padding-left:5% !important;
                    padding-right:5% !important;
                }
                td[class="specbundle3"] 
                {
                    width:90% !important;
                    float:left !important;
                    font-size:14px !important;
                    line-height:18px !important;
                    display:block !important;
                    padding-left:5% !important;
                    padding-right:5% !important;
                    padding-bottom:20px !important;
                    text-align:center !important;
                }
                td[class="specbundle4"] 
                {
                    width: 100% !important;
                    float:left !important;
                    font-size:13px !important;
                    line-height:17px !important;
                    display:block !important;
                    padding-bottom:20px !important;
                    text-align:center !important;

                }

            }


        </style>
        <script type="colorScheme" class="swatch active">
            {
            "name":"Default",
            "bgBody":"F6F6F6",
            "link":"62A9D2",
            "color":"999999",
            "bgItem":"ffffff",
            "title":"555555"
            }
        </script>

    </head>
    <body paddingwidth="0" paddingheight="0"   style="padding-top: 0; padding-bottom: 0; padding-top: 0; padding-bottom: 0; background-repeat: repeat; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased;" offset="0" toppadding="0" leftpadding="0" style="margin-left:5px; margin-right:5px; margin-top:0px; margin-bottom:0px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="tableContent bgBody" align="center"  style='font-family:helvetica, sans-serif;'>
            <!--  =========================== The header ===========================  -->
            <tbody>
                <tr>
                    <td height='25' bgcolor='#F6F6F6' colspan='3'></td>
                </tr>
                <tr>
                    <td><table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr>
                                    <td valign="top" class="spechide"><table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tbody>
                                                <tr>
                                                    <td height='130' bgcolor='#F6F6F6'>&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td>&nbsp;</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td valign="top" width="600"><table width="600" border="0" cellspacing="0" cellpadding="0" align="center" class="MainContainer" bgcolor="#ffffff">
                                            <tbody>
                                                <!--  =========================== The body ===========================  -->   
                                                <tr>
                                                    <td class='movableContentContainer'>
                                                        <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                                                <tr>
                                                                    <td bgcolor='#ffb035' valign='top'>
                                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                                                            <tr>
                                                                                <td align='center' valign='middle' >
                                                                                    <div class="contentEditableContainer contentImageEditable">
                                                                                        <div class="contentEditable" >
                                                                                            <img src="http://34.223.229.37/imgs/icon.png" alt='Compagnie logo' data-default="placeholder" data-max-width="100" width='100'/>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                        <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                                                <tr><td height='25' bgcolor='#ffffff'></td></tr>

                                                                <tr><td height='5' bgcolor='#ffffff'></td></tr>

                                                                <tr><td height=12' bgcolor="#ffffff"></td></tr>
                                                                <tr><td height=20' bgcolor="#fff"></td></tr>
                                                            </table>
                                                        </div>
                                                        <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                                            <table valign="top" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="spechide" width="16">&nbsp;</td>
                                                                        <td class="specbundle2" width="568">
                                                                            <table valign="top" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
                                                                                <tbody>

                                                                                    <tr>
                                                                                        <td valign="top" align="left">
                                                                                            <div class="contentEditableContainer contentTextEditable">
                                                                                                <div class="contentEditable" style="color:#565656;font-size:15px;line-height:28px; font-weight: normal; border-left: 4px solid #724089; padding: 0 15px;">
                                                                                                    <p>You have changed email address. Please verify it with given OTP.</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr><td height="20">&nbsp;</td></tr>

                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                        <td class="spechide" width="16">&nbsp;</td>
                                                                    </tr>
                                                                    <tr><td colspan="3" height="16">&nbsp;</td></tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                      
                                                        <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top' style="background:#724089;" >

                                                                <tr><td height='28'></td></tr>

                                                                <tr>
                                                                    <td valign='top' align='center'>
                                                                        <div class="contentEditableContainer contentTextEditable">
                                                                            <div class="contentEditable" style="font-size:18px; padding: 6px 0; line-height: 16px;">
                                                                                <span style="color:#fff; font-size: 18px; margin:10px 0px; padding-right: 10px; float: left; text-align: right; width: 46%;">User Name/Email  :</span>
                                                                                <span style="color:#eee; font-size: 18px; margin:10px 0px;  padding-left: 10px;  float: left; text-align: left; width: 46%;">${obj.email}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="contentEditableContainer contentTextEditable">
                                                                            <div class="contentEditable" style="font-size:18px; padding: 6px 0; line-height: 16px; margin-top: 20px">
                                                                                <span style="color:#fff; font-size:18px; margin:10px 0px;   padding-right: 10px;  float: left; width: 46%; text-align: right; ">OTP  :</span>
                                                                                <span style="color:#eee; font-size:18px; margin:10px 0px; padding-left: 10px; float: left; width: 46%; text-align: left; ">${obj.token}</span>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>

                                                                <tr><td height='28'></td></tr>
                                                            </table>
                                                        </div>

                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td valign="top" class="spechide"><table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tbody>
                                                <tr>
                                                    <td height='130' bgcolor='#F6F6F6'>&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td>&nbsp;</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>      
    </body>
</html>

        `
        }
        smtptransport.sendMail(options, function (err, data) {
            if (err) {
                console.log('err', err);
                cb('err', err);
            }
            if (data) {
                console.log('data', data);
                cb('sent', data);
            }
        });
    }
}
