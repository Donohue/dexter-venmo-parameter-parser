module.exports = {
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var message = step.input('message').first();
        var parts = message.split(' ');
        var username = undefined;
        var amount = undefined;
        var other_words = []
        var self = this;
        for (var i = 0; i < parts.length; i++) {
            if (parts[i][0] == '@' && parts[i].length > 1) {
                username = parts[i].substr(1);
            }
            else if (parts[i][0] == '$' && parts[i].length > 1) {
                amount = parseInt(parts[i].substr(1));
            }
            else {
                other_words.push(parts[i]);
            }
        }

        if (username == undefined || username.length == 0) {
            return self.fail({
                message: 'A Venmo username was not found. The username must contain an "@" before it (e.g. @Username)',
                input: step.inputs()
            });
        }
        else if (amount == undefined || isNaN(amount)) {
            return self.fail({
                message: 'A valid amount was not found. The amount must contain a "$" before it (e.g. $20)',
                input: step.inputs()
            });
        }
        else if (other_words.length == 0) {
            return self.fail({
                message: 'You must include a message along with the Venmo username and amount',
                input: step.inputs()
            });
        }

        var note = other_words.join(' ');
        self.complete({
            'username': username,
            'amount': amount,
            'note': note
        });
    }
};
