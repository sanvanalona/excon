class Excon {
    constructor(wantsStack, stackSize) {
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
            navy:{count:{id:2,as:3},visible:true},
            fuchsia:{count:0,visible:true},
            aqua:{count:0,visible:true},
            teal:{count:0,visible:true},
        }

        this.queue = []

        this.fontSize = '16px';
        this.padding = '20px 5px';
        this.fontColor = 'white';
        this.display = 'block'
        this.setStyle = `font-size:${this.fontSize};padding:${this.padding};padding-right:100px;color:${this.fontColor};display:block;`;
        if (wantsStack) {
            stackSize = typeof stackSize === 'undefined' ? 3 : stackSize;
            navigator.userAgent.includes("Chrome") ? this.userAgent = "Chrome" : '';
            navigator.userAgent.includes("Firefox") ? this.userAgent = "Firefox" : '';
        }
        
        this.warn = console.warn.bind({})
        this.log = console.log.bind({})
        this.error = console.error.bind({})
        
        console.warn = (message) => {
            this.queue.push({message:message,type:"warn"})
            this.displayQueue();
        }
        
        console.log = (message) => {
            this.queue.push({message:message,type:"log"})
            this.displayQueue();
        }
        
        console.error = (message) => {
            this.queue.push({message:message,type:"error"})
            this.displayQueue();
        }
        
    

    }

    displayQueue(){
        // this.log(this.queue)
        for(let i = 0;i<this.queue.length;i++){
            // this.error(this.queue[i].type)
            if(this.queue[i].type === "warn"){
                this.warn(this.queue[i].message)
                continue;
            }

            if(this.queue[i].type === "error"){
                this.error(this.queue[i].message);
                continue;
            }

            if(this.queue[i].type === "log"){
                this.log(this.queue[i].message)
            }
            else{
            this.log(this.queue[i].message,this.queue[i].style)
            }
        }

        this.queue = [];
    }


    defineMessage(message) {

        let parsedMessage = []

        for(let i = 0;i<message.length;i++){

            if (typeof message[i] === "object") {
                parsedMessage.push(`${i}:` + this.objector(message[i]) + "\n");
                continue;
            }
            if (Array.isArray(message[i])) {
                parsedMessage.push(`${i}:` + this.arraytor(message[i]) + "\n")
                continue;
            }

            parsedMessage.push(`${i}:` + message[i] + "\n");


        }
        let browser = this.getBrowserMessage()
        return `${parsedMessage.join("")}\n\n${browser}`
    }

     getBrowserMessage() {
        if(!this.wantsStack){return ''}
        let err = new Error;
        err = err.stack.split("\n");
        if(this.userAgent === "Chrome"){
            return err[4];
        }
        else{
            return err[4]
        }
    }
    
    red(){
        let message = this.defineMessage(arguments)


        
        let style = this.setStyle + 'background-color:red;'
        
        this.queue.push({message:`%c${message}`,style:style,type:"red"})
        this.displayQueue();
    
    }

    queue(){
        this.log("hi")
    }

    blue(){
        let message = this.defineMessage(arguments)

        let style = this.setStyle + 'background-color:blue'
        console.log(`%c${message}`,style)
        this.usage.blue.count++
    }

    black(){
        let message = this.defineMessage(arguments)

        let style = this.setStyle + 'background-color:black'
        console.log(`%c${message}`,style)
        this.usage.black.count++
    }

    purple(){
        let message = this.defineMessage(arguments)

        let style = this.setStyle + 'background-color:purple'
        console.log(`%c${message}`,style)
        this.usage.purple.count++
    }

    orange(){
        let message = this.defineMessage(arguments)

        let style = this.setStyle + 'background-color:orange'
        console.log(`%c${message}`,style)
        this.usage.orange.count++
    }

    grey(){
        let message = this.defineMessage(arguments)

        let style = this.setStyle + 'background-color:grey'
        console.log(`%c${message}`,style)
        this.usage.grey.count++
    }

    green(){
        let message = this.defineMessage(arguments)

        let style = this.setStyle + 'background-color:green'
        console.log(`%c${message}`,style)
        this.usage.green.count++
    }

    navy(){
        let message = this.defineMessage(arguments)

        let style = this.setStyle + 'background-color:navy'
        console.log(`%c${message}`,style)
        this.usage.navy.count++
    }

    fuchsia(){
        let message = this.defineMessage(arguments)

        let style = this.setStyle + 'background-color:fuchsia'
        console.log(`%c${message}`,style)
        this.usage.fuchsia.count++
    }

    agua(){
        let message = this.defineMessage(arguments)

        let style = this.setStyle + 'background-color:#00FFFF;color:black;'
        console.log(`%c${message}`,style)
        this.usage.aqua.count++
    }

    teal(){
        let message = this.defineMessage(arguments)

        let style = this.setStyle + 'background-color:teal'
        console.log(`%c${message}`,style)
        this.usage.teal.count++
    }

    look(){
        let message = this.defineMessage(arguments)

        let lookStyle = 'font-size:60px;color:red;font-weight:bold;margin-bottom:-200px;'

        console.log(`%cLOOK HERE`,lookStyle)
        this.black(message)
    }

    hide(){
        let toHide = arguments;
        
        for(let i = 0;i<arguments.length;i++){
            console.log(arguments[i])
            this.usage[arguments[i]].visible = false;
        }
        
    }


    help(){
        let message = this.objector(this.usage);

        this.black(`excon helper + usage \n ${message}`)
    }




    objector(message) {
        let obj = JSON.stringify(message).split("")
        let count = 1;

        for (let i = 0; i < obj.length; i++) {
            if (obj[i] === "{" || obj[i] === ",") {
                obj[i] === "{" ? count++ : null

                obj[i] = `${obj[i]}\n`;
                for (let j = 0; j < count; j++) {
                    obj[i] += "  "
                }
            }

            if (obj[i] === "}") {
                count--;
            }
        }

        obj[0] = `Object:\n ${obj[0]}`


        return obj.join("").replace(/\"/gi, "")
    }

    arraytor(arr) {
        arr = JSON.stringify(arr).split("");
        for (let i = 0; i < arr.length; i++) {
            (arr[i] === "]" && arr[i + 1] === ",") ? arr[i + 1] += "\n" : '';

        }
        arr[0] = `Array:\n${arr[0]}`
        return arr.join("")
    }

}

export let excon = new Excon(true)


