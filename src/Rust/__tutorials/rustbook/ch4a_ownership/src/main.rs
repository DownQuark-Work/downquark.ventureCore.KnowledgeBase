fn main() {
  let mut s = String::from("hello");
  s.push_str(", world!!!"); // push_str() appends a literal to a String
  println!("{}", s); // This will print `hello, world!`

  memory_with_move()
}

fn memory_with_move() {
  let x = 5;
  let y = x;
  // 👆 assigning new var to existing int _**DUPLICATES**_ memory in heap
  println!("x = {}, y = {}", x, y);

  let string_literal = "stringy";
  let _string_literal_copy = string_literal;
    // 👆 assigning new var to existing string literal _**DUPLICATES**_ memory in heap
  println!("{}, does NOT throw", string_literal);

  let string_type = String::from("mock-dynamic-text");
  let string_type_copy = string_type;
    // 👆 assigning new var to existing `String` type _**POINTS**_ new var to memory in heap
      // _**AND**_ invalidates original var in memory
    println!("{}, does NOT throw", string_type_copy);
    // println!("{}, `string_type` DOES throw", string_type);
    println!("{{}}`string_type` WOULD throw");
    println!("TRY: `% rustc --explain E0382`");

    variables_with_clone()
}

fn variables_with_clone() {
  let s1 = String::from("hello");
  let s2 = s1.clone(); // clone allows heap data to be duplicated
  println!("s1 = {}, s2 = {}", s1, s2);

  ownership_with_fncs()
}

////// Function Examples
fn takes_ownership(some_string: String) { // some_string comes into scope
  println!("{}", some_string);
} // Here, some_string goes out of scope and `drop` is called.
// The backing memory is freed.

fn makes_copy(some_integer: i32) { // some_integer comes into scope
  println!("{}", some_integer);
} // Here, some_integer goes out of scope. Nothing special happens.

fn ownership_with_fncs() {
  let s = String::from("hello");  // s comes into scope
  takes_ownership(s);             // s's value moves into the function...
                                  // ... and so is no longer valid here

  let x = 5;                      // x comes into scope
  makes_copy(x);                  // x would move into the function,
  println!("x={} i32 is COPY", x);// i32 is Copy - able to use x afterward

  ownership_with_fnc_returns();
} // Here, x goes out of scope, then s. But because s's value was moved, nothing
// special happens.

////// Function Return Examples
fn gives_ownership() -> String {  // moves return value into calling function
  let some_string = String::from("yours"); // some_string comes into scope
  some_string // some_string is returned - moves to calling function
}
// This function takes a String and returns one
fn takes_and_gives_back(a_string: String) -> String { // a_string comes into scope
  a_string  // a_string is returned and moves out to the calling function
}
fn ownership_with_fnc_returns() {
  let s1 = gives_ownership(); // gives_ownership moves its return value into s1
  let s2 = String::from("hello");     // s2 comes into scope
  let s3 = takes_and_gives_back(s2); // s2 is moved into takes_and_gives_back & moves return value into s3
  println!("s1: {}, s2 WOULD THROW, s3: {}", s1, s3);

  retain_ownership_tuple()
} // s1 goes out of scope and is dropped.
// s2 was moved, so nothing happens.
// s3 goes out of scope and is dropped.

/////
// Retaining Onwership
fn calculate_length(s: String) -> (String, usize) {
  let length = s.len(); // len() returns the length of a String
  (s, length)
}
fn retain_ownership_tuple() {
  let s1 = String::from("hello");
  let (s2, len) = calculate_length(s1);
  println!("The length of '{}' is {}.", s2, len);

  retain_ownership_reference()
}

fn retain_ownership_reference() {
  println!("SEE ch4b_reference");
}