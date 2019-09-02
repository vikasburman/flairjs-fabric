/**
 * @name Bootware
 * @description Bootware base class
 */
$$('abstract');
$$('ns', '(auto)');
Class('(auto)', function() {
    /**  
     * @name construct
     * @arguments
     *  name: string - name of the bootware
     *  version: string - version number of the bootware
    */
    $$('virtual');
    this.construct = (name, version, isMountSpecific) => {
        let args = Args('name: string, version: string',
                        'name: string, version: string, isMountSpecific: boolean',
                        'name: string, isMountSpecific: boolean',
                        'name: string')(name, version, isMountSpecific); args.throwOnError(this.construct);

        // set info
        this.info = Object.freeze({
            name: args.values.name || '',
            version: args.values.version || '',
            isMountSpecific: args.values.isMountSpecific || false
        });
    };

    /**  
     * @name boot
     * @arguments
     *  mount: object - mount object
    */
    $$('virtual');
    $$('async');
    this.boot = noop;

    $$('readonly');
    this.info = null;

    /**  
     * @name ready
    */
    $$('virtual');
    $$('async');
    this.ready = noop;

    $$('virtual');
    this.dispose = noop;

    $$('protected');
    this.getMountSpecificSettings = (sectionName, routing, mountName, checkDuplicateOnProp) => {
        let section = [];

        // get all.before
        if (routing.all && routing.all.before && routing.all.before[sectionName]) {
            section.push(...routing.all.before[sectionName]);
        }

        // get from mount
        if (routing[mountName] && routing[mountName][sectionName]) {
            if (section.length === 0) { 
                section.push(...routing[mountName][sectionName]);
            } else {
                if (checkDuplicateOnProp) {
                    for(let specificItem of routing[mountName][sectionName]) {
                        let alreadyAddedItem = findItemByProp(section, checkDuplicateOnProp, specificItem[checkDuplicateOnProp]);
                        if (alreadyAddedItem !== null) { // found with same propertyValue for givenProp
                            for(let p in specificItem) { // iterate all defined properties only, rest can be same as found earlier
                                alreadyAddedItem[p] = specificItem[p]; // overwrite all values with what is found here, as this more specific
                            }
                        } else {
                            section.push(specificItem); // add
                        }
                    }
                } else {
                    for(let specificItem of routing[mountName][sectionName]) {
                        if (typeof specificItem === 'string') {
                            if (section.indexOf(specificItem) !== -1) { // found
                                // ignore, as it is already added
                            } else { 
                                section.push(specificItem); // add
                            }                  
                        } else { // object
                            section.push(specificItem); // add, as no way to check for duplicate
                        }
                    }
                }
            }
        }

        // get from all.after
        if (routing.all && routing.all.after && routing.all.after[sectionName]) {
            if (section.length === 0) {
                section.push(...routing.all.after[sectionName]);
            } else {
                if (checkDuplicateOnProp) {
                    for(let afterItem of routing.all.after[sectionName]) {
                        let alreadyAddedItem = findItemByProp(section, checkDuplicateOnProp, afterItem[checkDuplicateOnProp]);
                        if (alreadyAddedItem !== null) { // found with same propertyValue for givenProp
                            // skip as more specific version is already added
                        } else {
                            section.push(afterItem); // add
                        }
                    }
                } else {
                    for(let afterItem of routing.all.after[sectionName]) {
                        if (typeof afterItem === 'string') {
                            if (section.indexOf(afterItem) !== -1) { // found
                                // ignore, as it is already added
                            } else { 
                                section.push(afterItem); // add
                            }                  
                        } else { // object
                            section.push(afterItem); // add, as no way to check for duplicate
                        }
                    }
                } 
            }
        }
        
        // return
        return section;
    };
});
