const { Payload } = await ns('flair.app');

/**
 * @name HandlerResult
 * @description Handler's structured result
 */
Class('', function() {
    $$('virtual');
    this.construct = (error, payload, resHeaders) => {
        let status = 200,
            message = 'OK',
            esx = 'Exception';

        // check if extended Payload
        if (payload && is(payload, Payload)) {
            status = payload.status || status;
            this.isExtendedPayload = true;
        }

        // get status and status message
        if (error && error.name) {
            message = error.name || (env.isServer ? 'InternalServerError' : 'InternalClientError');
            switch(error.name) {
                case 'Continue' + esx: 
                    status = 100; break;
                case 'NoContent' + esx: 
                    status = 204; break;
                case 'Redirect' + esx: 
                    status = 302; break;
                case 'NotModified' + esx:
                    status = 304; break;
                case 'InvalidArgument' + esx:
                case 'InvalidOperation' + esx:
                    status = 406; break; // not acceptable
                case 'Unauthorized' + esx: 
                    status = 401; break;
                case 'NotFound' + esx: 
                    status = 404; break;
                case 'NotAllowed' + esx: 
                case 'NotAvailable' + esx: 
                case 'NotSupported' + esx: 
                    status = 405; break;
                case 'OperationConflict' + esx: 
                case 'Duplicate' + esx: 
                    status = 409; break;
                case 'NotImplemented' + esx: 
                case 'NotDefined' + esx: 
                    status = 501; break;
                default:
                    status = 500; break;
            }
        }
        this.status = status;
        this.message = message;

        this.isError = error ? true : false;
        if (error && env.isDebug) {
            this.message += `\n${error.message || ''}`; 
            this.message += `\n${error.stack || ''}`;
        }
        this.data = payload || null;
        if (Array.isArray(resHeaders)) { this.resHeaders.push(...resHeaders); }
    };

    $$('private');
    this.isExtendedPayload = false;

    $$('readonly');
    this.status = 500;

    $$('readonly');
    this.message = '';

    $$('readonly');
    this.isError = false;

    $$('readonly');
    this.data = null;

    $$('readonly');
    this.resHeaders = [];

    this.value = (isMinimal) => {
        if (isMinimal && !this.isError) {
            return Object.freeze({
                data: (this.isExtendedPayload ? this.data.data : this.data)
            });
        } else { // either not minimal or there is an error
            return Object.freeze({
                isError: this.isError,
                status: this.status,
                message: this.message,
                data: (this.isExtendedPayload ? this.data.data : this.data)
            });
        }
    };
});
