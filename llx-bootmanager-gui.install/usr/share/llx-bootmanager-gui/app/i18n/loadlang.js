var language = process.env.LANG;
var i18n = new I18n(language,'llx-bootmanager-client');
try{
	i18n.loadfile();
}
catch(err){
	alert(err);
	var i18n = new I18n('en','llx-bootmanager-client');
	i18n.loadfile();
}