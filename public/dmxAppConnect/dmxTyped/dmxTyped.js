/*!
 App Connect Typed
 Version: 2.0.0
 (c) 2024 Wappler.io
 @build 2024-04-15 17:48:46
 */
dmx.Component("typed",{attributes:{strings:{type:String,default:""},speed:{type:Number,default:0},delay:{type:Number,default:0},backSpeed:{type:Number,default:0},backDelay:{type:Number,default:700},smartBackspace:{type:Boolean,default:!1},shuffle:{type:Boolean,default:!1},fade:{type:Boolean,default:!1},loop:{type:Boolean,default:!1},hidecursor:{type:Boolean,default:!1}},methods:{toggle(){this._typed.toggle()},stop(){this._typed.stop()},start(){this._typed.start()}},events:{complete:Event},init(){this.props.strings.split(",");this._typed=new Typed(this.$node,{strings:this.props.strings.split(","),typeSpeed:this.props.speed,startDelay:this.props.delay,backSpeed:this.props.backSpeed,backDelay:this.props.backDelay,smartBackspace:this.props.smartBackspace,shuffle:this.props.shuffle,fadeOut:this.props.fade,loop:this.props.loop,showCursor:!this.props.hidecursor})},performUpdate(e){this._typed.destroy(),this.init()},destroy(){this._typed.destroy()}});
//# sourceMappingURL=dmxTyped.js.map
