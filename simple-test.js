var Step = require("step"),
	simplesmtp = require("simplesmtp"),
	emailutil = require("./test/lib/email"),
   	 oneEmail = emailutil.oneEmail,
    	confirmEmail = emailutil.confirmEmail;



smtp = simplesmtp.createServer({disableDNSValidation: true});
Step(
	function() {
        	smtp.listen(1623, this);
		console.log('listening on 1623');
	},
	function () {
//              smtp.end(function(err) {});
		console.log('do the oneEmail stuff');
                oneEmail(smtp, "jamessr@pump.test", this.parallel());

	},
	function(){
		console.log('confirmEmail');
               confirmEmail(message, this.callback);
	}
);

