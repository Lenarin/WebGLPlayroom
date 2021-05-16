import {GUI} from "dat.gui";

GUI.prototype.addThreeColor=function(obj,varName){
  const dummy={};
  dummy[varName]=obj[varName].getStyle();
  return this.addColor(dummy,varName)
    .onChange(function( colorValue  ){
      obj[varName].setStyle(colorValue);
    });
};