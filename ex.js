// ES5 생성자 함수
function Person(name) {
  this.name = name;
}

// 프로토타입 메서드
Person.prototype.sayHi = function () {
  console.log("Hi! My name is " + this.name);
};

// 인스턴스 생성
var me = new Person("Lee");
me.sayHi(); // Hi! My name is Lee
