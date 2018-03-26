class Excon{
    constructor(wantsStack){
        this.userAgent = '';
        this.wantsStack = wantsStack;
        this.usage = {
            red:{count:0,visible:true},
            blue:{count:0,visible:true},
            black:{count:0,visible:true},
            purple:{count:0,visible:true},
            orange:{count:0,visible:true},
            grey:{count:0,visible:true},
            green:{count:0,visible:true},
            navy:{count:0,visible:true},
            fuchsia:{count:0,visible:true},
            aqua:{count:0,visible:true},
            teal:{count:0,visible:true},
            groupCollapsed:{count:0,visible:true},
        }

        this.queue = [];
        this.prevQueue = [];
        this.hiddenLogs = 0;

        this.fontSize = '14px';
        this.padding = '10px 5px';
        this.fontColor = 'white';
        this.display = 'block'
        this.setStyle = `font-size:${this.fontSize};padding:${this.padding};color:${this.fontColor};display:inline-block;border-radius:2px;`;
        
        navigator.userAgent.includes("Chrome") ? this.userAgent = "Chrome" : '';
        navigator.userAgent.includes("Firefox") ? this.userAgent = "Firefox" : '';
    
    }

    displayQueue(){
        for(let i = 0;i<this.queue.length;i++){
            let styleMarker = this.queue[i].style;
            
            try{
                if(this.usage[styleMarker].visible === false){continue;}
            }
            catch(error){}
            
            let style = this.setStyle + `background-color:${this.queue[i].style}`

            if(this.queue[i].type === "groupEnd"){
                console.groupEnd();
                continue;
            }
            if(this.queue[i].type === "groupCollapsed"){
                console.groupCollapsed(`%c${this.queue[i].message}`,style)
                continue;
            }

            if(this.queue[i].type === "table"){
                console.table(this.queue[i].message);
                console.groupEnd();
            }

            if(!this.queue[i].type){
                if(this.queue[i].multi){
                   
                    let style2 = style + ';color:black;margin-top:-100px;font-weight:bold;text-stroke:solid white 1px;'
                    console.log(`%c${this.queue[i].message}`,style,style2)
                }
                else{
            console.log(`%c${this.queue[i].message}`,style)
                }
            this.usage[this.queue[i].style].count += 1
            }

            // this.queue.splice(i,1)
        }

        this.queue = [];

        window.exconUsage = this.usage;
        window.exconQueue = this.prevQueue;
    }

    defineMessage(message,style){

        let isStrings = true;
        message.map(e=>{typeof e !== "string" ? isStrings = false : ''})
        //if everything in the message is a string just concat 
        //the whole message and push it to the queue
        if(isStrings){
            this.queue.push({message:message.join(","),style:style});
            this.prevQueue.push({message:message.join(','),style:style})

            this.displayQueue();
            return;
        }
        else{
            this.objector(message,style);
        }

            this.displayQueue();
            return;
    }

    parser(message){
        let arr = [];
            let arrCount = 0;
            for(let key in message){
                if(typeof message[key] === "object"){
                let val = this.parser(message[key]);
                arr.push({key:key,val:val});

                }
                else{
                    let val = message[key];
                arr.push({key:key,val:val});

                }
                
            }

            return arr

    }

    rebuildObj(arr,style){
        for(let i = 0;i<arr.length;i++){
            if(typeof arr[i].val === "object"){
                
                if(Array.isArray(arr[i].val) && arr[i].val.length === 0){
                    arr[i].val = "[null]"
                    this.queue.push({message:`${arr[i].key}: %c${arr[i].val}`,style:style,multi:true})
                }
                else{
                    this.queue.push({message:arr[i].key,type:"groupCollapsed",style:style})

                    this.rebuildObj(arr[i].val,style)

                    // this.queue.push({type:"groupEnd"})
                }
            }
            else{
                
                if(typeof arr[i].val === "string" && arr[i].val !== ''){arr[i].val = `"${arr[i].val}"`}

                if(arr[i].val === ''){
                    arr[i].val = "%c[emptyString]"; 
                    arr[i].multi=true
                }

                this.queue.push({message:`${arr[i].key}: ${arr[i].val}`,style:style,multi:arr[i].multi === true})
            }
        }

        this.queue.push({type:"groupEnd"})


    }

    parseObj(obj,style){
        let message = obj.message
        let count = 0;

        for(let key in message){
            if(typeof message[key] === "object"){
                count++;
            }
        }

        if(count === 0){
            this.queue.push({message:obj.message,type:"table",style:style})
        }
        else{
            
            let arr = this.parser(obj.message)
            this.rebuildObj(arr,style);
        }
    }

    objector(message,style){

        let setter = [];

        //Sets all the indexs and the type of the each message
        for(let i = 0;i<message.length;i++){
            if(typeof message[i] === "string"){
                setter.push({message:message[i],index:i,type:"string"});
            }
            else{
                setter.push({message:message[i],index:i,type:"object"})
            }
        }

        if(setter.length < 3){
        if(setter[0].type === "string"){

            this.queue.push({message:setter[0].message,style:style,type:"groupCollapsed"})

            this.prevQueue.push({message:setter[0].message,style:style,type:"groupCollapsed"})
        }
        else{
            this.queue.push({message:"[Object]",style:style,type:"groupCollapsed"})

            this.prevQueue.push({message:"[Object]",style:style,type:"groupCollapsed"})
            
        }
    }

        
        //Get all the objects in the array and parse them.
        let obj = setter.filter(e=>e.type === "object" ? true: false)
        
        for(let i = 0;i<setter.length;i++){
            //If the first type is a string set the groupCollpased message to that string.
            //If it isn't a string set the groupCollpased to just "Object"
                
                if(setter.length > 2){
                    if(setter[0].type === "string"){

                        this.queue.push({message:setter[0].message,style:style,type:"groupCollapsed"})
            
                        this.prevQueue.push({message:setter[0].message,style:style,type:"groupCollapsed"})
                    }
                    else{
                        this.queue.push({message:"[Object]",style:style,type:"groupCollapsed"})
            
                        this.prevQueue.push({message:"[Object]",style:style,type:"groupCollapsed"})
                        
                    }
            }
            
            if(setter[i].type === "object"){
                this.parseObj(setter[i],style);
            }
        }

        this.queue.push({type:"groupEnd"})
        this.prevQueue.push({type:"groupEnd"})

    }

    hide(){
        let hiders = Array.from(arguments);

        for(let i = 0;i<hiders.length;i++){
            this.usage[hiders[i]].visible = false;
        }

        setTimeout(()=>{console.log(`there are ${this.hiddenLogs} hidden excon logs`)},1000)

    }

    red(){
        if(this.usage.red.visible){
        let message = Array.from(arguments)
        // console.log(arguments)
        message = this.defineMessage(message,"red")
        }
        else{
            this.hiddenLogs++
            
        }
    }
}

export let excon = new Excon(true)