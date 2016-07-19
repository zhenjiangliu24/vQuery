/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function myAddEvent(obj,sEv,fn)
{
    if(obj.attachEvent)
    {
        obj.attachEvent('on'+sEv,function()
        {
            if(!fn.call(obj))
            {
                event.cancelBubble=true;
                return false;
            }
            //fn.call(obj);
        });
    }else
    {
        obj.addEventListener(sEv,function(ev)
        {
            if(!fn.call(obj))
            {
                event.cancelBubble=true;
                ev.preventDefault();
            }
            //fn.call(obj);
        }, false);
    }
}
function getByClass(obj,cName)
{
    var arrAll = obj.getElementsByTagName('*');
    var aResult = [];
    var i = 0;
    for(i=0; i<arrAll.length;i++)
    {
        if(arrAll[i].className===cName)
        {
            aResult.push(arrAll[i]);
        }
    }
    return aResult;
}
function getStyle(obj, attr)
{
    if(obj.currentStyle)
    {
        return obj.currentStyle[attr];
    }else
    {
        return getComputedStyle(obj,false)[attr];
    }
}
function VQuery(vArg)
{
    this.elements=[];
    switch(typeof vArg)
    {
        case 'function':
            myAddEvent(window,'load',vArg);
            break;
        case 'string':
            switch(vArg.charAt(0))
            {
                case '#':
                    var obj=document.getElementById(vArg.substring(1));
                    this.elements.push(obj);
                    break;
                case '.':
                    this.elements=getByClass(document,vArg.substring(1));
                    break;
                default:
                    this.elements=document.getElementsByTagName(vArg);
                    
            }
            break;
        case 'object':
            this.elements.push(vArg);
            break;
    }
}
function $(vArg)
{
    return new VQuery(vArg);
}
VQuery.prototype.click=function(fn)
{
    var i =0;
    for(i=0;i<this.elements.length;i++)
    {
        myAddEvent(this.elements[i],'click',fn);
    }
    return this;
};
VQuery.prototype.show=function()
{
    var i =0;
    for(i=0;i<this.elements.length;i++)
    {
        this.elements[i].style.display='block';
    }
    return this;
};
VQuery.prototype.hide=function()
{
    var i =0;
    for(i=0;i<this.elements.length;i++)
    {
        this.elements[i].style.display='none';
    }
    return this;
};
VQuery.prototype.hover=function(fnOver,fnOut)
{
    var i = 0;
    for(i=0;i<this.elements.length;i++)
    {
        myAddEvent(this.elements[i],'mouseover',fnOver);
        myAddEvent(this.elements[i],'mouseout',fnOut);
    }
    return this;
};
VQuery.prototype.css = function(attr,value)
{
    if(arguments.length===2)
    {
        var i = 0;
        for(i=0; i<this.elements.length;i++)
        {
            this.elements[i].style[attr]=value;
        }
    }else
    {
        if(typeof attr==='string')
        {
            return getStyle(this.elements[0],attr);
        }else
        {
            for(i=0;i<this.elements.length;i++)
            {
                var k = '';
                for(k in attr)
                {
                    this.elements[i].style[k]=attr[k];
                }
            }
        }
        
    }
    return this;
};
VQuery.prototype.toggle = function()
{
    
    var i = 0;
    var _arguments = arguments;
    for(i=0;i<this.elements.length;i++)
    {
        addToggle(this.elements[i]);
    }
    function addToggle(obj)
    {
        var count = 0;
        myAddEvent(obj,'click',function()
        {
            _arguments[count++%_arguments.length].call(obj);
        });
    }
    return this;
};
VQuery.prototype.attr=function(attr,value)
{
    if(arguments.length===2)
    {
        var i =0;
        for(i=0;i<this.elements.length;i++)
        {
            this.elements[i][attr]=value;
        }
    }else
    {
        return this.elements[0][attr];
    }
    return this;
};
VQuery.prototype.eq=function(n)
{
    return $(this.elements[n]);
};
function appendArray(arr1,arr2)
{
    var i = 0;
    for(i=0;i<arr2.length;i++)
    {
        arr1.push(arr2[i]);
    }
}
VQuery.prototype.find=function(str)
{
    var i =0;
    var aResult=[];
    for(i=0;i<this.elements.length;i++)
    {
        switch(str.charAt(0))
        {
            case '.':
                var arrEle = getByClass(this.elements[i],str.substring(1));
                appendArray(aResult,arrEle);
                break;
            default:
                var arrEle = this.elements[i].getElementsByTagName(str);
                appendArray(aResult,arrEle);
        }
    }
    var newVQuery=$();
    newVQuery.elements=aResult;
    return newVQuery;
};
function getIndex(obj)
{
    var aBrother = obj.parentNode.children;
    var i =0;
    for(i=0;i<aBrother.length;i++)
    {
        if(aBrother[i]===obj)
        {
            return i;
        }
    }
}
VQuery.prototype.index=function()
{
    return getIndex(this.elements[0]);
};
VQuery.prototype.bind = function(sEv,fn)
{
    var i = 0;
    for(i=0;i<this.elements.length;i++)
    {
        myAddEvent(this.elements[i],sEv,fn);
    }
};
VQuery.prototype.extend = function(name,fn)
{
    VQuery.prototype[name]=fn;
};