sap.ui.define(["oft/fiori/controller/BaseController","sap/ui/core/Core","sap/ui/model/Filter","sap/ui/model/FilterOperator","oft/fiori/models/formatter","sap/ui/core/Fragment","sap/m/MessageBox","sap/m/MessageToast"],function(e,t,a,i,n,o,r,s){"use strict";return e.extend("oft.fiori.controller.InvoiceBuilder",{formatter:n,onInit:function(){this.oRouter=sap.ui.core.UIComponent.getRouterFor(this);this.oRouter.attachRoutePatternMatched(this.onBankAccount,this);this.oLocalModel=this.getOwnerComponent().getModel("local");this.totalCount=0;var e=this;$.ajax({type:"GET",url:"getLogo",success:function(t){e.logo=t},error:function(e,t,a){sap.m.MessageToast.show("error in fetching logo")}});$.ajax({type:"GET",url:"getAnubhavTrainingsLogo",success:function(t){e.AnubhavTrainingslogo=t},error:function(e,t,a){sap.m.MessageToast.show("error in fetching logo")}});if(!e.soyuz_signature){$.ajax({type:"GET",url:"getSoyuzSignature",success:function(t){e.soyuz_signature=t},error:function(e,t,a){sap.m.MessageToast.show("error in fetching signature")}})}if(!e.anubhav_signature){$.ajax({type:"GET",url:"getanubhavTrainingsSignature",success:function(t){e.anubhav_signature=t},error:function(e,t,a){sap.m.MessageToast.show("error in fetching signature")}})}},formatter:n,setRandomInvoiceNo:function(){var e=new Date,t=e.getMonth()+1,a=e.getFullYear();this.oLocalModel.setProperty("/PerformaInvoices/InvoiceNo","INV-"+a+(t<10?"0"+t:t)+"-"+Math.floor(Math.random()*1e3))},onBankAccount:function(e){var t=new Date;var a=t.getMonth()+1;var i=t.getFullYear();var n=new Date(i+" "+a);this.getView().byId("idDate").setValue(n.toDateString().slice(4));this.getView().byId("idDueDate").setValue(t.toDateString().slice(4));this.setRandomInvoiceNo()},onCourseChange:function(e){if(e.getParameter("value").includes("GST Exempt")){this.getView().byId("idGSTType").setSelectedKey("NONE")}},onDeletePerformaInvoice:function(e){var t=this;var a=this.getView().byId("idPerformaInvoiceTable").getSelectedContexts();if(a.length>0){a.forEach(function(e){t.ODataHelper.callOData(t.getOwnerComponent().getModel(),e.sPath,"DELETE",{},{},t).then(function(e){s.show("Deleted succesfully")}).catch(function(e){t.getView().setBusy(false);t.oPopover=t.getErrorMessage(e);t.getView().setBusy(false)})})}else{s.show("Please select an item")}},onCurrencyLiveChange:function(e){var t=e.getParameter("value").toUpperCase();e.getSource().setValue(t);var a=this.oLocalModel.getProperty("/PerformaInvoices/AccountNo");if(t!=="INR"){var i=this.oLocalModel.getProperty("/PerformaInvoices/Amount");var n="Please make payment using Paypal with the below link-\nhttps://www.paypal.com/paypalme/anubhavstraining/"+i;this.oLocalModel.setProperty("/PerformaInvoices/Notes",n)}else if(a==="114705500444"&&t==="INR"){var n="Please make payment before the due date in below a/c and share the screenshot with us\n"+"Account Number:                  "+a+"\n"+"Account Type:                       "+(this.accountDetails.current?"Current":"Saving")+"\n"+"Account name:                      "+this.accountDetails.accountName+"\n"+"IFSC Code:                            "+this.accountDetails.ifsc+"\nYou can also pay with barcode scan of UPI https://www.anubhavtrainings.com/upi-payment-gateway";this.oLocalModel.setProperty("/PerformaInvoices/Notes",n)}else if(t==="INR"){var n="Please make payment before the due date in below a/c and share the screenshot with us\n"+"Account Number:                  "+a+"\n"+"Account Type:                       "+(this.accountDetails.current?"Current":"Saving")+"\n"+"Account name:                      "+this.accountDetails.accountName+"\n"+"IFSC Code:                            "+this.accountDetails.ifsc;this.oLocalModel.setProperty("/PerformaInvoices/Notes",n)}},onAmount:function(e){if(this.oLocalModel.getProperty("/PerformaInvoices/Currency")!=="INR"){var t="Please make payment using Paypal with the below link-\nhttps://www.paypal.com/paypalme/anubhavstraining/"+e.getParameter("value");this.oLocalModel.setProperty("/PerformaInvoices/Notes",t)}},onSave:function(){var e=this;var t=this.getView().getModel("local").getProperty("/PerformaInvoices");if(!t.CompanyName){s.show("Please Fill All Mandatory Fields");return}t.Date=new Date(t.Date);t.DueDate=new Date(t.DueDate);this.ODataHelper.callOData(this.getOwnerComponent().getModel(),"/PerformaInvoices","POST",{},t,this).then(function(t){e.getView().setBusy(false);sap.m.MessageToast.show("Saved successfully");e.setRandomInvoiceNo()}).catch(function(t){e.getView().setBusy(false);r.error(t)})},onUpdateFinishedPerforma:function(){debugger;var e=this.getView().byId("idPerformaInvoiceTable");var t=e.getItems();var a=t.length;for(var i=0;i<a;i++){var n=t[i].getCells()[8].getText();var o=this.allAppUsers[n];if(o){var r=o.UserName;t[i].getCells()[8].setText(r)}}},onUpdateFinished:function(e){var t="Entry found";var a=this.getView().byId("invoiceTabTable");var i=a.getItems();var n=i.length;for(var o=0;o<n;o++){var r=i[o].getCells()[2].getText();var s="Courses('"+r+"')";var l=this.getView().getModel().oData[s];if(l){var u=l.BatchNo+": "+l.Name;i[o].getCells()[2].setText(u)}var c=i[o].getCells()[0].getText();var d="Students('"+c+"')";debugger;var h=this.allStudnets[c];if(h){var g=h.GmailId;i[o].getCells()[0].setText(g)}}if(a.getBinding("items").isLengthFinal()){var m=e.getParameter("total");if(this.totalCount===0||this.totalCount<m){this.totalCount=m}var p=a.getItems().length;t+="("+p+"/"+this.totalCount+")"}this.getView().byId("titletext").setText(t)},onPerformaInvoice:function(e){var t=this;var a=e.getSource().getParent().getBindingContextPath();this.ODataHelper.callOData(this.getOwnerComponent().getModel(),a,"GET",{},{},this).then(function(e){e.IsGST=false;t.DownloadInvoiceForOther(e,e.InvoiceNo)}).catch(function(e){t.getView().setBusy(false);var a=t.getErrorMessage(e)})},onDownloadInvoice:function(e){var t=this;var a=e.getSource().getParent().getBindingContextPath();this.ODataHelper.callOData(this.getOwnerComponent().getModel(),a,"GET",{},{},this).then(function(e){t.ODataHelper.callOData(t.getOwnerComponent().getModel(),"/Students('"+e.StudentId+"')","GET",{},{},t).then(function(a){t.ODataHelper.callOData(t.getOwnerComponent().getModel(),"/Courses('"+e.CourseId+"')","GET",{},{},t).then(function(i){var n=(a.Address!="null"?a.Address+", ":"")+(a.City!="null"?a.City+", ":"");var o=new RegExp("haryana","i");var s=o.test(n);var l="NONE";var u="INR";if(s||a.GSTIN==="null"){l="SGST"}else{l="IGST"}if(e.PaymentMode==="PAYPAL"||e.PaymentMode==="PAYU"||e.PaymentMode==="FOREIGN"){l="NONE";u="USD"}if(t.getView().byId("idNoGST").getSelected()){l="NONE"}var c={Email:a.GmailId,ParticipentName:a.Name.replace(" null",""),ContactNo:a.ContactNo,GSTIN:a.GSTIN==="null"?null:a.GSTIN,Address:a.Address==="null"?null:a.Address,Country:a.Country,City:a.City,CourseName:e.Amount<7e3?i.Name+"(Ex.)":i.Name,BatchNo:i.BatchNo,PaymentMode:e.PaymentMode,InvoiceNo:e.InvoiceNo,Date:e.PaymentDate,AccountNo:e.AccountName,FullAmount:e.USDAmount?e.USDAmount:e.Amount,USDAmount:e.USDAmount,Reference:e.Reference,Currency:u,Amount:e.USDAmount?e.USDAmount:e.Amount,GSTType:l};if(e.InvoiceNo==="null"){$.post("/getInvoiceNoInvoiceBuilder",{AccountNo:e.AccountName,SubcriptionId:e.id,PaymentDate:e.PaymentDate}).done(function(e,a){t.DownloadInvoiceForOther(c,e)}).fail(function(e,t,a){r.error("Error in Invoice no.")})}else{t.DownloadInvoiceForOther(c,e.InvoiceNo)}}).catch(function(e){t.getView().setBusy(false);var a=t.getErrorMessage(e)})}).catch(function(e){t.getView().setBusy(false);var a=t.getErrorMessage(e)})}).catch(function(e){t.getView().setBusy(false);var a=t.getErrorMessage(e)})},DownloadInvoiceForOther:function(e,t){var a=e.Country;var i=new Date(e.Date).toDateString().slice(4).split(" ");i=i[0]+" "+i[1]+", "+i[2];var n=null;if(e.DueDate){n=new Date(e.DueDate).toDateString().slice(4).split(" ");n=n[0]+" "+n[1]+", "+n[2]}var o=[{Course:e.CourseName,HSN:"999293",Qty:1,Rate:e.GSTType!=="NONE"?(parseFloat(e.Amount)*100/118).toFixed(2):e.Amount,IGST:e.GSTType!=="NONE"?18:0,Amount:e.GSTType!=="NONE"?(parseFloat(e.Amount)*100/118).toFixed(2):e.Amount}];const r={shipping:{name:e.CompanyName?e.CompanyName:e.ParticipentName,email:e.Email,mob:e.ContactNo?"+"+e.ContactNo:"",GSTIN:e.GSTIN!==null?e.GSTIN:"",address:(e.Address!=null?e.Address+", ":"")+(e.City!="null"?e.City+", ":"")+(e.State?e.State+", ":"")+a},items:o,IGST:e.GSTType!=="NONE"?18:0,fullAmount:parseFloat(e.Amount).toFixed(2),order_number:t,paymentMode:e.PaymentMode,IsWallet:e.IsWallet,header:{company_name:e.AccountNo.indexOf("114705500444")!==-1?"Soyuz Technologies LLP":"Anubhav Trainings",company_logo:e.AccountNo.indexOf("114705500444")!==-1?"data:image/png;base64,"+this.logo:"data:image/png;base64,"+this.AnubhavTrainingslogo,signature:e.AccountNo.indexOf("114705500444")!==-1?"data:image/png;base64,"+this.soyuz_signature:"data:image/png;base64,"+this.anubhav_signature,company_address:e.AccountNo.indexOf("114705500444")!==-1?"EPS-FF-073A, Emerald Plaza,\\Golf Course Extension Road,\\Sector 65, Gurgaon,\\Haryana-122102":"B-25 Shayona shopping center,\\Near Shayona Party Plot,\\Chanikyapuri, Ahemdabad\\Pin - 380061",GSTIN:e.GSTType!=="NONE"?"06AEFFS9740G1ZS":""},footer:{text:"This is a computer generated invoice"},currency_symbol:e.Currency,date:{billing_date:i,due_date:n?n:""}};let s=(t,a)=>{if(this.logo){t.image(a.header.company_logo,50,45,{width:50}).fontSize(20).text(a.header.company_name,110,57).fontSize(10);if(e.GSTType!=="NONE"&&e.AccountNo==="114705500444"){t.text("GSTIN: "+a.header.GSTIN,112,87)}t.moveDown()}else{t.fontSize(20).text(a.header.company_name,50,45).fontSize(10).text("GSTIN: "+a.header.GSTIN,50,75).moveDown()}if(a.header.company_address.length!==0){y(t,a.header.company_address)}};let l=(t,a)=>{t.fillColor("#444444").fontSize(20);if(e.Notes){t.text("Performa Invoice",50,160)}else{t.text("Invoice",50,160)}m(t,185);const i=200;t.fontSize(10).text("Name:",50,i).font("Helvetica-Bold").text(a.shipping.name,150,i).font("Helvetica").text("E-mail:",50,i+15).text(a.shipping.email,150,i+15);t.text("GSTIN:",50,i+45-15).text(a.shipping.GSTIN,150,i+45-15);t.fontSize(10).text("Address:",50,i+60-15).text(a.shipping.address,150,i+60-15).text("Invoice Number:",350,i).font("Helvetica-Bold").text(a.order_number,450,i).font("Helvetica").text("Invoice Date:",350,i+15).text(a.date.billing_date,450,i+15).text("Due Date:",350,i+30).text(a.date.due_date,450,i+30).moveDown();m(t,280)};let u=(t,a)=>{let i;const n=300;const o=a.currency_symbol;t.font("Helvetica-Bold");if(e.GSTType==="SGST"){g(t,n,"Description","Rate","SGST","CGST","Amount")}else{h(t,n,"Description","Rate","IGST","Amount")}m(t,n+20);t.font("Helvetica");var r=0;var s=0;for(i=0;i<a.items.length;i++){const o=a.items[i];const s=n+(i+1)*30;if(e.GSTType==="SGST"){o.SGST=o.IGST/2;o.CGST=o.IGST/2;g(t,s,o.Course+(e.GSTType!=="NONE"?"\nHSN/SAC: "+o.HSN:""),o.Rate,o.SGST,o.CGST,o.Amount)}else{h(t,s,o.Course+"\nHSN/SAC: "+o.HSN,o.Rate,o.IGST,o.Amount)}r+=parseFloat(o.Amount);m(t,s+28)}if(e.GSTType==="SGST"){const o=n+(i+1)*35;t.font("Helvetica-Bold");d(t,o,"Sub Total:",p(r.toFixed(2)));const s=o+20;t.font("Helvetica-Bold");d(t,s,"SGST:",p(e.GSTType!=="NONE"?(r*.09).toFixed(2):0));const u=s+20;t.font("Helvetica-Bold");d(t,u,"CGST:",p(e.GSTType!=="NONE"?(r*.09).toFixed(2):0));var l=u+20;t.font("Helvetica-Bold");d(t,l,"Total ("+e.Currency+"):",p(a.fullAmount))}else{const o=n+(i+1)*35;t.font("Helvetica-Bold");d(t,o,"Sub Total:",p(r.toFixed(2)));const s=o+20;t.font("Helvetica-Bold");d(t,s,"IGST:",p(e.GSTType!=="NONE"?(r*.18).toFixed(2):0));var l=s+20;t.font("Helvetica-Bold");d(t,l,"Total ("+e.Currency+"):",p(a.fullAmount))}let u=l;m(t,u+20);t.font("Helvetica-Bold").text("Amount in Words:",50,u+30).text(this.formatter.convertNumberToWords(a.fullAmount)+" only",150,u+30);m(t,u+50);if(e.Notes){t.font("Helvetica-Bold").text("Notes: ",50,u+75).font("Helvetica").text(e.Notes,50,u+90).font("Helvetica-Bold").text("Remarks: ",50,u+165).font("Helvetica").text(e.CourseName+"Training fee for "+e.Email+". Please note that the actual invoice will be generated after payment.",50,u+180).font("Helvetica-Bold").text("Terms: ",50,u+215).font("Helvetica").text(e.Terms?e.Terms:"",50,u+230)}if(!e.Notes&&e.Reference!=="null"){t.font("Helvetica-Bold").text("Remarks: ",50,u+215).font("Helvetica").text("Thanks for making payment on"+a.date.billing_date+"with reference no "+(e.Reference!=="null"?e.Reference:""),50,u+230)}const c=u+205;if(e.AccountNo==="114705500444"){t.text(a.header.company_name,430,c).image(a.header.signature,440,c+20,{height:50,width:110}).text("Designated Partner",440,c+80).moveDown()}else{t.text(a.header.company_name,430,c).image(a.header.signature,420,c+20,{height:80,width:155}).text("Designated Partner",440,c+105).moveDown()}};let c=(e,t)=>{if(t.footer.text.length!==0){m(e,760);e.fontSize(8).text(t.footer.text,50,770,{align:"right",width:500})}};let d=(e,t,a,i)=>{e.fontSize(10).text(a,380,t,{width:90,align:"right"}).text(i,0,t,{align:"right"})};let h=(e,t,a,i,n,o)=>{e.fontSize(10).text(a,50,t).text(i,300,t,{width:90,align:"right"}).text(n+"%",380,t,{width:90,align:"right"}).text(o,0,t,{align:"right"})};let g=(e,t,a,i,n,o,r)=>{e.fontSize(10).text(a,50,t).text(i,260,t,{width:90,align:"right"}).text(n+"%",320,t,{width:90,align:"right"}).text(o+"%",380,t,{width:90,align:"right"}).text(r,0,t,{align:"right"})};let m=(e,t)=>{e.strokeColor("#aaaaaa").lineWidth(1).moveTo(50,t).lineTo(550,t).stroke()};let p=(e,t="")=>{if(e){var a=e.toString().split(".");var i=a.length>1?"."+a[1]:"";a=a[0];var n=a.substring(a.length-3);var o=a.substring(0,a.length-3);if(o!="")n=","+n;var r=o.replace(/\B(?=(\d{2})+(?!\d))/g,",")+n;return r+i+t}else{return e+t}};let f=e=>{if(e.length!==0){var t=e.replace(/[^0-9]/g,"")}else{var t=0}return t};let v=e=>{let t=f(e);if(Number.isNaN(t)===false&&t<=100&&t>0){var a=e}else{var a="---"}return a};let S=(e,t)=>{let a=f(t);if(Number.isNaN(a)===false&&a<=100){let t="."+a;var i=e*(1+t)}else{var i=e*(1+taxValue)}return i};let y=(e,t)=>{let a=t;let i=a.split("\\");let n=50;i.forEach(function(t,a){e.fontSize(10).text(i[a],300,n,{align:"right"});n=+n+15})};let I=a=>{var i=new PDFDocument({size:"A4",margin:40});var n=i.pipe(blobStream());s(i,a);l(i,a);u(i,a);c(i,a);i.end();n.on("finish",function(){const i=n.toBlob("application/pdf");const o=n.toBlobURL("application/pdf");const r=document.createElement("a");r.href=o;r.download=t+"_"+e.Country+"_"+a.shipping.name;r.click()})};I(r)},onSelect:function(e){this.sId=e.getSource().getId();debugger;var t="",n="";if(this.sId.indexOf("accountDetails")!==-1){var o=new sap.ui.model.Filter("deleted",i.EQ,false);t="Account Search";this.getCustomerPopup();var r="Account Search";var s=new sap.ui.model.Sorter({path:"value",descending:false});this.searchPopup.setTitle(r);this.searchPopup.bindAggregation("items",{path:"local>/accountSet",filters:[o],sorter:s,template:new sap.m.DisplayListItem({label:"{local>value}",value:"{local>key}"})})}else if(this.sId.indexOf("idbatchId")!==-1||this.sId.indexOf("idCourse_upd")!==-1||this.sId.indexOf("idCourseSearch")!==-1){var l=new a("hidden",i.EQ,false);this.getCustomerPopup();var r=this.getView().getModel("i18n").getProperty("batch");this.searchPopup.setTitle(r);this.searchPopup.bindAggregation("items",{path:"/Courses",filters:[l],template:new sap.m.DisplayListItem({label:"{Name}",value:"{BatchNo}"})})}else if(this.sId.indexOf("idStuSearch")!==-1){this.getCustomerPopup();var r=this.getView().getModel("i18n").getProperty("customer");this.searchPopup.setTitle(r);this.searchPopup.bindAggregation("items",{path:"/Students",template:new sap.m.DisplayListItem({label:"{Name}",value:"{GmailId}"})})}else if(this.sId.indexOf("idEmailCust1")!==-1){this.getCustomerPopup();var r=this.getView().getModel("i18n").getProperty("customer");this.searchPopup.setTitle(r);this.searchPopup.bindAggregation("items",{path:"/Inquries",template:new sap.m.DisplayListItem({label:"{EmailId}",value:"{FirstName}"})})}},onConfirm:function(e){if(this.sId.indexOf("accountDetails")!==-1){var t=e.getParameter("selectedItem").getValue();this.accountDetails=this.oLocalModel.getProperty(e.getParameter("selectedItem").getBindingContextPath());this.oLocalModel.setProperty("/PerformaInvoices/AccountNo",t);var a=this.oLocalModel.getProperty("/PerformaInvoices/Currency");if(t==="114705500444"&&a==="INR"){var i="Please make payment before the due date in below a/c and share the screenshot with us\n"+"Account Number:                  "+t+"\n"+"Account Type:                       "+(this.accountDetails.current?"Current":"Saving")+"\n"+"Account name:                      "+this.accountDetails.accountName+"\n"+"IFSC Code:                            "+this.accountDetails.ifsc+"\nYou can also pay with barcode scan of UPI https://www.anubhavtrainings.com/upi-payment-gateway";this.oLocalModel.setProperty("/PerformaInvoices/Notes",i)}else if(a==="INR"){var i="Please make payment before the due date in below a/c and share the screenshot with us\n"+"Account Number:                  "+t+"\n"+"Account Type:                       "+(this.accountDetails.current?"Current":"Saving")+"\n"+"Account name:                      "+this.accountDetails.accountName+"\n"+"IFSC Code:                            "+this.accountDetails.ifsc;this.oLocalModel.setProperty("/PerformaInvoices/Notes",i)}}else if(this.sId.indexOf("idCourseSearch")!==-1){var n=this.getSelectedKey(e);this.SearchCourseGuid=n[2];this.getView().byId("idCourseSearch").setValue(n[0]+": "+n[1])}else if(this.sId.indexOf("idStuSearch")!==-1){var n=this.getSelectedKey(e);this.SearchStuGuid=n[2];this.getView().byId("idStuSearch").setValue(n[0])}else if(this.sId.indexOf("idEmailCust1")!==-1){var n=this.getSelectedKey(e);this.getView().byId("idEmailCust1").setValue(n[1]);if(true){var o=this;var r={};var s=new sap.ui.model.Filter("GmailId","EQ",n[1]);this.ODataHelper.callOData(this.getOwnerComponent().getModel(),"/Students","GET",{filters:[s]},r,this).then(function(e){debugger;if(e.results.length!=0){o.oLocalModel.setProperty("/PerformaInvoices",{InvoiceNo:"INV-YYYYMM-DD",CompanyName:e.results[0].Company==="null"?null:e.results[0].Company,ParticipentName:e.results[0].Name,CourseName:null,Amount:0,GSTType:e.results[0].GSTCharge?"IGST":"NONE",Date:null,DueDate:null,Address:e.results[0].Address==="null"?null:e.results[0].Address,City:e.results[0].City==="null"?null:e.results[0].City,Country:e.results[0].Country,Currency:"INR",GSTIN:e.results[0].GSTIN==="null"?null:e.results[0].GSTIN,Notes:null,Terms:null,AccountNo:null,Email:null})}}).catch(function(e){})}}},onLiveSearch:function(e){var t=e.getParameter("query");if(!t){t=e.getParameter("value")}if(this.sId.indexOf("idStuSearch")!==-1){if(t){var a=new sap.ui.model.Filter("Name",sap.ui.model.FilterOperator.Contains,t);var i=new sap.ui.model.Filter("GmailId",sap.ui.model.FilterOperator.Contains,t);var n=new sap.ui.model.Filter({filters:[a,i],and:false});var o=[n];this.searchPopup.getBinding("items").filter(o)}else{this.searchPopup.bindAggregation("items",{path:"/Students",template:new sap.m.DisplayListItem({label:"{Name}",value:"{GmailId}"})});this.searchPopup.getBinding("items").filter([])}}else if(this.sId.indexOf("idCourseSearch")!==-1){if(t){var a=new sap.ui.model.Filter("Name",sap.ui.model.FilterOperator.Contains,t);var i=new sap.ui.model.Filter("BatchNo",sap.ui.model.FilterOperator.Contains,t);var n=new sap.ui.model.Filter({filters:[a,i],and:false});var o=[n];this.searchPopup.getBinding("items").filter(o)}else{this.searchPopup.bindAggregation("items",{path:"/Courses",template:new sap.m.DisplayListItem({label:"{Name}",value:"{BatchNo}"})});this.searchPopup.getBinding("items").filter([])}}else if(this.sId.indexOf("accountDetails")!==-1){if(t){var a=new sap.ui.model.Filter("value",sap.ui.model.FilterOperator.Contains,t);var i=new sap.ui.model.Filter("key",sap.ui.model.FilterOperator.Contains,t);var n=new sap.ui.model.Filter({filters:[a,i],and:false});var o=[n];this.searchPopup.getBinding("items").filter(o)}else{this.searchPopup.bindAggregation("items",{path:"local>/accountSet",template:new sap.m.DisplayListItem({label:"{local>value}",value:"{local>key}"})});this.searchPopup.getBinding("items").filter([])}}else if(this.sId.indexOf("idEmailCust")!==-1){if(t){var a=new sap.ui.model.Filter("EmailId",sap.ui.model.FilterOperator.Contains,t);var i=new sap.ui.model.Filter("FirstName",sap.ui.model.FilterOperator.Contains,t);var n=new sap.ui.model.Filter({filters:[a,i],and:false});var o=[n];this.searchPopup.getBinding("items").filter(o)}else{this.searchPopup.bindAggregation("items",{path:"/Inquries",template:new sap.m.DisplayListItem({label:"{EmailId}",value:"{FirstName}"})});this.searchPopup.getBinding("items").filter([])}}},onSearchManageSubs:function(e){var t=this;var a=[];var i=this.oLocalModel.getProperty("/InvoiceBuilder/StudentId");var n=this.oLocalModel.getProperty("/PerformaInvoices/AccountNo");var o=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;if(o.test(i)&&!t.SearchStuGuid){var r={};var s=new sap.ui.model.Filter("GmailId","EQ",i);this.ODataHelper.callOData(this.getOwnerComponent().getModel(),"/Students","GET",{filters:[s]},r,this).then(function(e){a.push(new sap.ui.model.Filter("StudentId","EQ","'"+e.results[0].id+"'"));if(t.SearchCourseGuid){a.push(new sap.ui.model.Filter("CourseId","EQ","'"+t.SearchCourseGuid+"'"))}if(n){a.push(new sap.ui.model.Filter("AccountName","EQ",n))}var i=t.getView().byId("idPaymentdate");if(i._lastValue!=false){var o=i._lastValue.split(".");var r=new Date(o[2],o[1]-1,o[0]);r.setHours(0,0,0,0);var o=i._lastValue.split(".");var s=new Date(o[2],o[1]-1,o[0]);s.setHours(23,59,59,999);var l=new sap.ui.model.Filter("PaymentDate","GE",r);var u=new sap.ui.model.Filter("PaymentDate","LE",s)}else{var c=new sap.ui.model.Filter}if(i._lastValue!=false){a.push(new sap.ui.model.Filter([l,u],true))}t.getView().byId("invoiceTabTable").getBinding("items").filter(a)}).catch(function(e){debugger})}else{if(t.SearchStuGuid){a.push(new sap.ui.model.Filter("StudentId","EQ","'"+t.SearchStuGuid+"'"))}if(t.SearchCourseGuid){a.push(new sap.ui.model.Filter("CourseId","EQ","'"+t.SearchCourseGuid+"'"))}if(n){a.push(new sap.ui.model.Filter("AccountName","EQ",n))}var l=t.getView().byId("idPaymentdate");if(l._lastValue!=false){var u=l._lastValue.split(".");var c=new Date(u[2],u[1]-1,u[0]);c.setHours(0,0,0,0);var u=l._lastValue.split(".");var d=new Date(u[2],u[1]-1,u[0]);d.setHours(23,59,59,999);var h=new sap.ui.model.Filter("PaymentDate","GE",c);var g=new sap.ui.model.Filter("PaymentDate","LE",d)}else{var m=new sap.ui.model.Filter}if(l._lastValue!=false){a.push(new sap.ui.model.Filter([h,g],true))}t.getView().byId("invoiceTabTable").getBinding("items").filter(a)}},onClearSearchFilter:function(e){var t=[];this.SearchCourseGuid=null;this.SearchStuGuid=null;this.getView().byId("idPaymentdate").setValue(null);this.getView().byId("idStuSearch").setValue(null);this.getView().byId("idCourseSearch").setValue(null);this.getView().byId("invoiceTabTable").getBinding("items").filter(t)},onFullScreen:function(e){var t=e.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getMode();if(t==="ShowHideMode"){e.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent().setMode("HideMode");e.getSource().setIcon("sap-icon://exit-full-screen");e.getSource().setText("Hide Fullscreen")}else{e.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent().setMode("ShowHideMode");e.getSource().setIcon("sap-icon://full-screen");e.getSource().setText("Show Fullscreen")}}})});