// This is a comment, and is ignored by the compiler
// You can test this code by clicking the "Run" button over there ->
// or if you prefer to use your keyboard, you can use the "Ctrl + Enter" shortcut

// This code is editable, feel free to hack it!
// You can always return to the original code by clicking the "Reset" button ->

// This is the main function
fn main() {
  // Statements here are executed when the compiled binary is called

  // Print text to the console
  println!("Hello World!");
  
  let x = 5 + /* 90 + */ 5;
  println!("Is `x` 10 or 100? x = {}", x);
}

// A binary can be generated using the Rust compiler: rustc.
// `$ rustc hello.rs`

// rustc will produce a hello binary that can be executed.
// `$ ./hello`