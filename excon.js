class Excon {
  constructor(wantsStack,wantsHiddenShown) {
    this.userAgent = '';
    this.wantsStack = wantsStack;
    this.usage = {
      red: { count: 0, visible: true },
      blue: { count: 0, visible: true },
      black: { count: 0, visible: true },
      purple: { count: 0, visible: true },
      orange: { count: 0, visible: true },
      grey: { count: 0, visible: true },
      green: { count: 0, visible: true },
      navy: { count: 0, visible: true },
      fuchsia: { count: 0, visible: true },
      aqua: { count: 0, visible: true },
      teal: { count: 0, visible: true },
      pink: { count: 0, visible: true },
     
    }

    this.wantsHiddenShown = wantsHiddenShown;

    this.queue = [];
    window.exconQueue = [];
    window.exconHidden = [];
    this.prevHiddenLogs = 0;
    this.hiddenLogs = 0;
    this.hideRan = false;

    this.fontSize = '14px';
    this.padding = '10px 5px';
    this.fontColor = 'white';
    this.display = 'block'
    this.setStyle = `font-size:${this.fontSize};padding:${this.padding};color:${this.fontColor};display:inline-block;border-radius:2px 0 0 2px;`;

    navigator.userAgent.includes("Chrome") ? this.userAgent = "Chrome" : '';
    navigator.userAgent.includes("Firefox") ? this.userAgent = "Firefox" : '';

  }

  //Displays the queue 
  displayQueue() {
    for (let i = 0; i < this.queue.length; i++) {
      let styleMarker = this.queue[i].style;

      try {
        if (this.usage[styleMarker].visible === false) { continue; }
      }
      catch (error) { }
      let st = this.queue[i].style
      let style = '';
      if(st === "pink" || st === "aqua"){
        style = this.setStyle + `background-color:${this.queue[i].style};color:black`
      }
      else{
        style = this.setStyle + `background-color:${this.queue[i].style}`
      }

      switch(this.queue[i].type){
        case "groupEnd":
          console.groupEnd();
          continue;

        case "groupCollapsed":
          if(this.queue[i].message.includes("%c")){
            let style2 = this.setStyle + 'font-size:5px;'
            console.groupCollapsed(`%c${this.queue[i].message}`, style,`text-align:right;font-size:12px;border:solid ${this.queue[i].style} 5px;padding:7px 5px;padding-bottom:6px;border-radius:0 2px 2px 0;display:inline-block;font-weight:default`)
          }
          else{
            
            console.groupCollapsed(`%c${this.queue[i].message}`, style)
          }
          continue;

        case "table":
          console.table(this.queue[i].message);
          console.groupEnd();
      }
      
      if (!this.queue[i].type) {
        if (this.queue[i].multi) {
          
          let style2 = style + ';color:black;margin-top:-100px;font-weight:bold;text-stroke:solid white 1px;'
          console.log(`%c${this.queue[i].message}`, style, style2)
        }
        else {
          if(this.queue[i].message.includes("%c")){
          console.log(`%c${this.queue[i].message}`, style,`text-align:right;font-size:12px;border:solid ${this.queue[i].style} 5px;padding:7px 5px;padding-bottom:6px;border-radius:0 2px 2px 0;display:inline-block`)
          }
          else{
            console.log(`%c${this.queue[i].message}`, style)
          }
        }
        this.usage[this.queue[i].style].count += 1
      }
    }
    
    window.exconUsage = this.usage;
    window.exconQueue.push(this.queue)
    this.queue = [];
    
  }
  
  getStackInfo(num){
     let err = new Error()
     err = err.stack.split("\n")
     err = err[num].split(" (")[0].replace(/at /,"").trim()
     return err;
  }
  defineMessage(message, style) {
    let stackInfo = this.getStackInfo(4);
    // console.log(stackInfo)
    let isStrings = true;
    message.map(e => { typeof e !== "string" ? isStrings = false : '' })
    //if everything in the message is a string just concat 
    //the whole message and push it to the queue
    let singleMessage = `${message.join('')}\n%c${stackInfo}`
    isStrings ? this.queue.push({ message: singleMessage, style: style, }) :  this.objector(message, style);
    this.displayQueue();
    return;
  }

  parser(message) {
    let arr = [];
    let arrCount = 0;
      for (let key in message) {
      typeof message[key] === "object" ? arr.push({key:key,val:this.parser(message[key])}) : arr.push({key:key,val:message[key]})
    }

    return arr

  }

  rebuildObj(arr, style) {
    let len = arr.length
    for (let i = 0; i < len; i++) {
      if (typeof arr[i].val === "object") {

        if (Array.isArray(arr[i].val) && arr[i].val.length === 0) {
          arr[i].val = "[null]"
          this.queue.push({ message: `${arr[i].key}: %c${arr[i].val}`, style: style, multi: true })
        }
        else {
          this.queue.push({ message: arr[i].key, type: "groupCollapsed", style: style })
          this.rebuildObj(arr[i].val, style)
        }
      }
      else {

        typeof arr[i].val === "string" && arr[i].val !== '' ? arr[i].val = `"${arr[i].val}"` : ''

        if (arr[i].val === '') {
          arr[i].val = "%c[emptyString]";
          arr[i].multi = true
        }

        this.queue.push({ message: `${arr[i].key}: ${arr[i].val}`, style: style, multi: arr[i].multi === true })
      }
    }

    this.queue.push({ type: "groupEnd" })


  }

  parseObj(obj, style) {
    let message = obj.message
    let count = 0;
    let getStackInfo = this.getStackInfo(5)

    for (let key in message) {
      if (typeof message[key] === "object") {
        count++;
      }
    }
    count === 0 ? this.queue.push({ message: obj.message, type: "table", style: style }) : this.rebuildObj(this.parser(obj.message), style);
  }

  objector(message, style) {

    let setter = [];
    let len = message.length
    let getStackInfo = this.getStackInfo(5)
    //Sets all the indexs and the type of the each message
    for (let i = 0; i < len; i++) {
      typeof message[i] === "string" ? setter.push({ message: message[i], index: i, type: "string" }) : setter.push({ message: message[i], index: i, type: "object" })
    }

    let topLevelMessage = `${setter[0].message}\n%c${getStackInfo}`
    if (setter.length < 3) {
      setter[0].type === "string" ? this.queue.push({ message: topLevelMessage, style: style, type: "groupCollapsed" }) : this.queue.push({ message: `[Object]\n%c${getStackInfo}`, style: style, type: "groupCollapsed" })
    }


    //Get all the objects in the array and parse them.
    let obj = setter.filter(e => e.type === "object" ? true : false)
    len = setter.length
    let setStackInfo = false;
    for (let i = 0; i < len; i++) {
      //If the first type is a string set the groupCollpased message to that string.
      //If it isn't a string set the groupCollpased to just "Object"

      if (setter.length > 2) {
        if(!setStackInfo){
        topLevelMessage = `${setter[0].message}\n%c${getStackInfo}`
        setStackInfo = true;
        }
        else{
          topLevelMessage = setter[0].message
        }
        setter[0].type === "string" ? this.queue.push({ message: topLevelMessage, style: style, type: "groupCollapsed" }) : this.queue.push({ message: `[Object]\n%c${getStackInfo}`, style: style, type: "groupCollapsed" })
      }

      setter[i].type === "object" ? this.parseObj(setter[i], style) : ''
    }

    this.queue.push({ type: "groupEnd" })

  }


  hideShower(){

    if(this.wantsHiddenShown === "note"){
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
          alert("This browser does not support desktop notification");
        }
      
        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
          // If it's okay let's create a notification
          var notification = new Notification(`There are ${this.hiddenLogs} hidden logs.`);
        }
      
        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== "denied") {
          Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
              var notification = new Notification(`There are ${this.hiddenLogs} hidden logs.`);
            }
          });
        }

        setTimeout(()=>{
          notification.close();
        },3000)
      }

      if(this.wantsHiddenShown === "console"){
        console.log(`%cThere are ${this.hiddenLogs} hidden logs.\nUse window.exconHidden to see all of the hidden logs`,'background-color:black;color:white;font-size:14px;padding:10px;font-family:"Verdana"')
      }
    }

  hide() {
    let hiders = Array.from(arguments);
    let len = hiders.length
    for (let i = 0; i < len; i++) {
      this.usage[hiders[i]].visible = false;
    }

    !this.setTimeOfHide ? this.setTimeOfHide = (new Date).getTime() - 7000 : '';

    let timeRan = (new Date).getTime();
    setTimeout(()=>{
      if(timeRan - this.setTimeOfHide > 5000 ){  
        this.setTimeOfHide = new Date().getTime();
        this.hideShower();
      }},1000)
}

//FINISH TIMER
timer(name){
  let sTime = (new Date()).getTime();
  window.addEventListener('DOMContentLoaded',()=>{
    let eTime = (new Date()).getTime();
    console.log(eTime-sTime);
    this.queue.push({message:eTime-sTime,style:"purple"})
  })

  window.removeEventListener('DOMContentLoaded',()=>{
    let eTime = (new Date()).getTime();

    // this.queue.push({message:eTime-sTime,style:"blue"})
  })
}

  red() {
    let getStackInfo = this.getStackInfo(3);
    let message = Array.from(arguments)
    if (this.usage.red.visible) {
      this.defineMessage(message, "red")
    }
    else {

      window.exconHidden.push({ message: message, style: "red",stackInfo:getStackInfo })
      this.hiddenLogs++
      this.hide();
    }
  }

  blue() {
    let getStackInfo = this.getStackInfo(3);
    let message = Array.from(arguments)
    if (this.usage.blue.visible) {
      this.defineMessage(message, "blue")
    }
    else {

      window.exconHidden.push({ message: message, style: "blue",stackInfo:getStackInfo })
      this.hiddenLogs++
      this.hide();
    }
  }

  pink() {
    let getStackInfo = this.getStackInfo(3);
    let message = Array.from(arguments)
    if (this.usage.pink.visible) {
      this.defineMessage(message, "pink")
    }
    else {

      window.exconHidden.push({ message: message, style: "pink",stackInfo:getStackInfo })
      this.hiddenLogs++
      this.hide();
    }
  }

  purple() {
    let getStackInfo = this.getStackInfo(3);
    let message = Array.from(arguments)
    if (this.usage.purple.visible) {
      this.defineMessage(message, "purple")
    }
    else {

      window.exconHidden.push({ message: message, style: "purple",stackInfo:getStackInfo })
      this.hiddenLogs++
      this.hide();
    }
  }

  orange() {
    let getStackInfo = this.getStackInfo(3);
    let message = Array.from(arguments)
    if (this.usage.orange.visible) {
      this.defineMessage(message, "orange")
    }
    else {

      window.exconHidden.push({ message: message, style: "orange",stackInfo:getStackInfo })
      this.hiddenLogs++
      this.hide();
    }
  }

  grey() {
    let getStackInfo = this.getStackInfo(3);
    let message = Array.from(arguments)
    if (this.usage.grey.visible) {
      this.defineMessage(message, "grey")
    }
    else {

      window.exconHidden.push({ message: message, style: "grey",stackInfo:getStackInfo })
      this.hiddenLogs++
      this.hide();
    }
  }

  green() {
    let getStackInfo = this.getStackInfo(3);
    let message = Array.from(arguments)
    if (this.usage.green.visible) {
      this.defineMessage(message, "green")
    }
    else {

      window.exconHidden.push({ message: message, style: "green",stackInfo:getStackInfo })
      this.hiddenLogs++
      this.hide();
    }
  }

  navy() {
    let getStackInfo = this.getStackInfo(3);
    let message = Array.from(arguments)
    if (this.usage.navy.visible) {
      this.defineMessage(message, "navy")
    }
    else {

      window.exconHidden.push({ message: message, style: "navy",stackInfo:getStackInfo })
      this.hiddenLogs++
      this.hide();
    }
  }

  fuchsia() {
    let getStackInfo = this.getStackInfo(3);
    let message = Array.from(arguments)
    if (this.usage.fuchsia.visible) {
      this.defineMessage(message, "fuchsia")
    }
    else {

      window.exconHidden.push({ message: message, style: "fuchsia",stackInfo:getStackInfo })
      this.hiddenLogs++
      this.hide();
    }
  }

  aqua() {
    let getStackInfo = this.getStackInfo(3);
    let message = Array.from(arguments)
    if (this.usage.aqua.visible) {
      this.defineMessage(message, "aqua")
    }
    else {

      window.exconHidden.push({ message: message, style: "aqua",stackInfo:getStackInfo })
      this.hiddenLogs++
      this.hide();
    }
  }

  teal() {
    let getStackInfo = this.getStackInfo(3);
    let message = Array.from(arguments)
    if (this.usage.teal.visible) {
      this.defineMessage(message, "teal")
    }
    else {

      window.exconHidden.push({ message: message, style: "teal",stackInfo:getStackInfo })
      this.hiddenLogs++
      this.hide();
    }
  }

  
}

export let excon = new Excon(true,"console")