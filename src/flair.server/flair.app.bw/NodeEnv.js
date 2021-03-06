const { Bootware } = await ns('flair.app');

/**
 * @name NodeEnv
 * @description Node Environment Settings
 */
$$('sealed');
Class('', Bootware, function() {
    $$('override');
    this.boot = async (base) => {
        base();

        if (settings.envVars.vars.length > 0) {
            const nodeEnv = await include('node-env-file | x');

            if (nodeEnv) {
                for(let envVar of settings.envVars.vars) {
                    nodeEnv(AppDomain.resolvePath(envVar), settings.envVars.options);
                }
            }
        }
    };
});
