
  var newNumError = function(message){
  throw new TypeError("Some error with " + start + " or " + count);
};
//Exceptions
function StopIteration (message) {
  this.name = "EndIteration";
  this.message = (message || "StopIteration");
}
StopIteration.prototype = new Error();

//Создание из массива объектов итератора
function ToIterator(data)
{
  var index = 0;
  var length = data.length;

  var coll=[];
  return {
    count:function(){
      return data.length;
    },

    next:function(){
      if(index < data.length)
        return data[index++];
      else
        throw new StopIteration("StopIteration");

    },

    item:function(){

      if(index > data.length)
        throw new RangeError("Iterator is end");
      else
        return data[index];
    },

    reset:function(){
      index = 0;
    },

    add:function(elem)
    {
       data.push(elem);
    },

    //Есть ли элемент в массиве
    has:function(item){

     while(next()!== null)
     {
       var elem=next();
       if(elem == item)
         return true;
     }

     return false;

    },

    hasNext:function(){

      return index < data.length;
    }




  };
};


function Iter(name)
    {
      Iter.prototype.name = ToIterator(name);

      //Типы для Ofcast
      Iter.prototype.String = "string";
      Iter.prototype.Number = "number";
      Iter.prototype.Object = "object";
      Iter.prototype.boolean = "boolean";
      Iter.prototype.Function = "function";
    }

Iter.prototype.next = function()
  {
    var par = Iterator(this.name);
    return function(){

      var itt = Iterator(this.name);
      return par.next();
    };

  };


//Циклический перебор значений
Iter.prototype.everynext = function()
  {
      var num = -1;
      var coll = this.name;
      return {
        next: function(){
          num++;
          return coll[num % coll.length];}

      };
  };


//Преобразование итератора в массив
Iter.prototype.toArray = function(itr)
  {
     var array=[];
     while(true)
     {
       try
       {
          var nums = this.name.next();
          if(nums === null)
            return array;
          array.push(nums);
       }catch(e)
       {
         return array;
       }
     }
  };


//Берём один параметр из нескольких массивов
Iter.prototype.Take = function(num, argum,
                              mainIter)
  {
    var result=[]
    result.push(mainIter);
    for(var i = 0;i <  argum.length;++i)
      {
        result.push(argum[i][num]);
      }

    return result;
  }

//Количество элементов
Iter.prototype.Count = function(expr)
  {

     var filtredResults=[];
     for(var i = 0;i < this.name.count();++i)
       {
         var value = this.name.next();
         if(expr.apply(this, [value]))
           filtredResults.push(value);
       }

    return new Iter(filtredResults);
  };

Iter.prototype.Zip = function()
  {
    var arr = [];

    console.assert(arguments > 0);
    //for(var i = 0;i <
    var length = arguments[0].length;
    for(var i = 0;i < length;++i)
      {
        var tempArray =
            this.Take(i,arguments,this.name.next());
        arr.push(tempArray);
      }

    return arr;

  }

//Упорядочиваем в порядке ключа

Iter.prototype.ThenBy = function()
  {
    var helpArray=[];
    var newArray = this.toArray(this.name);
    return new Iter(newArray.
                    sort(function(a,b){return a.length > b.length ;}));
  }


 //Первыми идут знчения, еоторые удовлетворяют неравеству
  Iter.prototype.TakeFirst = function(action)
    {
      for(var i = 0;i < this.name.count();++i)
        {
         var num = this.name.next();
         if(action(num))
           return num;
        }
    }


//Тоже самое, только теперь создаём новый итератор
Iter.prototype.TakeWhile = function(action)
    {
      var newArray=[]
      for(var i = 0;i < this.name.size();++i)
        {
         var num = this.name.next();
         if(action(num))
           newArray.push(num);
        }

      return new Iter(newArray);
    };


//Берём случайные эелемнты из последовательности

Iter.prototype.TakeRandomN = function(n)
  {
     if(n > this.name.count())
       return new Iter(this.name);
     var newArray=[];
     var thisArray = this.toArray(this.name);
      for(var i = 0;i < n;++i)
        {
          newArray.push(
            thisArray[Math.floor(Math.random() * this.name.count())
                     ]);
        }

      return new Iter(newArray);
  };



//Вспомогательный объект
function HelpIterator(Iter)
{
  this.Iter = Iter;
}


//Перебор значений
HelpIterator.prototype.AnyValue = function(func)
  {
     var value;
      while(this.Iter.hasNext())
      {
        value = this.Iter.next();
        if(func.apply(this, [value]))
          return value;
      }

    return value;
  }

var z = new Iter([7,5,2,4,8,9,2,7,8,9]);

var rg = new HelpIterator(new ToIterator([4,2,5]));
rg.AnyValue(function(a){return a < 2;});

//pong.sort(function(a,b){return a.length > b.length ;});
//console.log(z.Zip([4,2,5],["A", "B", "C"]));




//отфильтровывает функцию
Iter.prototype.filter = function(func)
  {

  };

//Where как в Linq

Iter.prototype.Where = function(num)
  {
    var arr = this.name;
    var i = 0;
    //(arr[i++] != num || i <= ar );
    if (i == arr.length)return false;
    return true;
  };

Iter.prototype.Any = function(){

  var arr = this.name;
  for(var i = 0; i < arr.length;++i)
    if(arr[i] === undefined) return false;

  return true;
};

Iter.prototype.Max = function(){
  return Math.max.apply(0,this.name);
};


Iter.prototype.Max = function(){
  return Math.min.apply(0,this.name);
};



Iter.prototype.Average = function(){

  var avg = 0;
  for(var i = 0;i < this.name.length;++i)
    avg += this.name[i];
  return avg/this.name.length;
};


Iter.prototype.Average = function(func){
          var rr = func(this.name);


};

Iter.prototype.Last = function(){
  return this.name[this.name.length-1];
};

Iter.prototype.LastOrDefault = function(def){

  var res = this.name[this.name.length-1];
  return (this.name.length === 0) ||
    (res === undefined)?def:res;
};


Iter.prototype.Range = function(sstart, ccount){

  start = sstart;count = ccount;

  var arr=[];
  if(!isFinite(start) || !isFinite(count) )
    newNumError("Some problems with start or count");
  /*if((isFinite(start)) or (isFinite(count)))
     newTypeError("Some problems with start or count");*/
  if(sstart === null)sstart = 0;
  if(ccount === null)count = 1;

  for(var i = start;i <= count;++i)
    arr.push(i);

  return arr;

};


//Первыми в массиве идут значения, которые удовлетворяют неравенству
/*Iter.prototype.takeFirst = function(vars){

  var result=[];
  var arr = this.name;
  for(var i = 0;i < arr.length;++i)
    if(vars(arr[i]))
      result.push(arr[i]);

  return result;

};*/

//Берём случайный элемент из последовательности

/*Iter.prototype.TakeRandom = function()
  {
     return this.name[
       Math.floor(Math.random() * this.name.length)];
  };*/



  //Записывать в массив пока выполняется условик
/*Iter.prototype.TakeWhile = function(pred)
    {
      if(pred === null)
        throw new TypeError("Iterator is failed");

      var result=[];
      var arr=this.name;

      for(var i in arr)
      {
         if(pred(arr[i]))
           result.push(arr[i]);
         else
           return result;
      }
      ///while(pred(arr[i++]))arr.push(arr[i]);
      return result;

    };*/


//считает клдичество вхождений всех элементов массива
//Возвращает map {элемент: количество раз}
Iter.prototype.CountElems = function()
  {
    var result = {};

    for (var i = 0; i < this.name.length;++i)
    {
      if(isNaN(result[this.name[i]]))
           result[this.name[i]] = 1;
      else
           result[this.name[i]]+=1;
    }
    return result;
  };


//Генерация повторяющегося значения
//value - значение
//num - количество раз
function Repeat(value, num)
{
   var result=[];
   if(num <= 0)
     newNumError("num is too tiny value");
   for(var i = 0;i < num;++i)
     result.push(value);

   return result;
};



//Возвращает уникальные элементы массивов
//arrs - массивы
//В prototype этот алгоритм реализован быстрее
function UniqueArray(arrs)
{
    var result=[];

  for(var lis in Iterator(arrs,false))
    {
      for (var i in Iterator(lis[1]))
      {
        if(result.indexOf(i[1]) == -1)
            result.push(i[1]);
      }
    }


   return result;
};


//Фильтрация элементов по заданному типу
Iter.prototype.OfType = function(type){

  var result=[];
  for(var i = 0;i< this.name.length;++i)
  {
    if(this.name instanceof type)
    if(typeof this.name[i] == type)
      result.push(this.name[i]);
  }

  return result;
};


//Среднее значение в векторах
Iter.prototype.Mean = function(){

  var arr = this.OfType(this.Number);
  var sum = 0;
  for(var i = 0; i < arr.length;++i)
    sum+=arr[i];
  console.log(sum);

  return sum/arr.length;
};

//Удалять до определённого элемента
Iter.prototype.RemoveTo =function(elem)
{
  var newarr=[];
};

Iter.prototype.Batch = function(nums)
{
  var newarr=[];
  var resultarr=[];

  return function(elem,exp){
    if(exp)
    {
       while(true)
             {
              try
              {
        if(newarr.length >= nums) {
            var e = newarr;
            resultarr.push(e);
            newarr=[]
    }
    newarr.push(elem.next());
              }catch(err)
              {
               resultarr.push(newarr);
               return resultarr;
              }
  }
  }
}(this.name,nums > 0);

return resultarr;

};

