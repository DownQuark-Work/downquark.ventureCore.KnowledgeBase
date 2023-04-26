use std::io;

fn main() {
  // addition
  let sum = 5 + 10;

  // subtraction
  let difference = 95.5 - 4.3;

  // multiplication
  let product = 4 * 30;

  // division
  let quotient = 56.7 / 32.2;
  let truncated = -5 / 3; // Results in -1

  // remainder
  let remainder = 43 % 5;

  // bool
  let t = true;
  let f: bool = false; // with explicit type annotation

  // char
  let c = 'z';
  let z: char = 'ℤ'; // with explicit type annotation
  let _heart_eyed_cat = '😻';

  // Compound types
    // tuple
  let tup: (i32, f64, u8) = (500, 6.4, 1);
  let (_x, y, _z) = tup;
  println!("The value of y is: {y}");
    // array
  let _a = [1, 2, 3, 4, 5];
  let _months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];
  let _b = [3; 5]; // equivalent: `let _b = [3, 3, 3, 3, 3];`
  let a: [i32; 5] = [1, 2, 3, 4, 5]; // typed :: `i32` -> type of each element. `5` -> array contains five elements

  println!("Please enter an array index.");

  let mut index = String::new();
  io::stdin()
      .read_line(&mut index)
      .expect("Failed to read line");

  let index: usize = index
      .trim()
      .parse()
      .expect("Index entered was not a number");

  let element = a[index];
  println!("The value of the element at index {index} is: {element}");
}
