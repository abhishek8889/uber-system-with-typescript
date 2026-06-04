// interface iObject {
//     first_name : string;
//     last_name : string;
//     getFullName() : string;
// }


// const obj : iObject = {
//     first_name : "John",
//     last_name : "Doe",
//     getFullName() : string {
//         return `${this.first_name} ${this.last_name}`;
//     }
// }

// console.log(`${obj.getFullName()} , ${obj.first_name}`);


// enum Direction {
//   Up = 1,
//   Down,
//   Left ,
//   Right
// }

// console.log(Direction.Up); // 1
// console.log(Direction.Down); // 2
// console.log(Direction.Left); // 3
// console.log(Direction.Right); // 4

// Generics in TypeScript
// function printArray<A, B>(arr: A[], arr2: B[]): void {
//   for (let i = 0; i < arr.length; i++) {
//     console.log(arr[i]);
//   }

// for (let i = 0; i < arr2.length; i++) {
//     console.log(arr2[i]);
//   }
// }

// printArray([1, 2, "Abhishek" ,"sharma" , 9], ["a", "b", "c" , true , false]); 



// let stri = 50 + 5;

// console.log(stri instanceof Number); // 50
// let num : number = stri as any as number;
// console.log(typeof num); // 50


// const user_id = Symbol("user_id");
// const user_idnew = Symbol("user_id");

// const newVa = user_id;

// console.log(newVa)

// const user = {
//     name : "Abhishek",
//     user_id : 54321 ,
//     [user_id] : 54321
// }

// user[user_id] = 48484;

// // console.log(user)

// const hello  = null;

// console.log( typeof hello)
// console.log( hello)

// if(null === undefined){
//     console.log("null and undefined are equal with == operator");
// }else{
//     console.log("null and undefined are not equal with == operator");
// }

// if(undefined == true){
//     console.log("null and false are equal with == operator");
// }else{
//     console.log("null and false are not equal with == operator");
// }

// console.log(user); 

// const tupleArr :tupple [number, string] = [1, "Abhishek"];
// enum color {
//     Red = "Red",
//     Green = "Green",
//     Blue = "Blue"
// }

// console.log(color.Red); // "Red"

// function sum ( num1 : number , num2 : number) : string {
//     const result =  num1 + num2;
//     return result as unknown as  string;
// }

// console.log(sum(5, 10)); // "15"

// let ab: undefined = undefined;

// // console.log(ab); // undefined
// function greet (name: string): void {
//     console.log(`Hello, ${name}!`);
//     // return true;
// }

// console.log(ab); // "Hello, Abhishek!" and then undefined


// function addNumbers(...nums:number[]) {  
 
//    console.log("sum of the numbers",nums) 
// } 


// addNumbers(1, 2, 3, 4, 5);
// addNumbers(6, 7, 8, 9, 10);


// function greet(name: string, age?: number): void {
//   if (typeof age === 'number') {
//     console.log(`You are ${age} years old.`);
//   }
// }
// greet('Shahid', 35);


interface user {
    name :string;
    age : number;
}

interface userDetails extends user {
    email? : string;
    photo? : string;
}


const bj : userDetails = {
    name : "Abhishek",
    age : 30 
}

console.log(bj)