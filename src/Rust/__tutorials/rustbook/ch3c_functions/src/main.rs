// ERROR with a semicolon at the end of the return line changes val from an expression to a statement
fn implicit_return() -> i32 {
  13
  // 13; <-- THROWS: expected `i32`, found `()`
    // also helpful with: _- help: remove this semicolon_
}
fn plus_one(x: i32) -> i32 {
  x + 1
}

fn main() {
  println!("Hello, world!");
  another_function();
  xanother_function(-13);
  print_labeled_measurement(5, 'h');

  block_function();
  let iret = implicit_return();
  let iretplusone = plus_one(iret);
  println!("The implicit_return is: {iret}");
  println!("The implicit_return + 1 is: {iretplusone}");

  conditionals();
  loops();
}

fn another_function() {
  println!("Another function.");
}
fn xanother_function(x: i32) {
  println!("The value of x is: {x}");
}

fn print_labeled_measurement(value: i32, unit_label: char) {
  println!("The measurement is: {value}{unit_label}");
}

fn block_function() {
  let y = {
      let x = 3;
      x + 1
  };
  println!("block funtion: The value of y is: {y}");
}

///

fn conditionals() {
  let number = 3;
  if number != 0 { // no truthy. `if number {` throws: _expected `bool`, found integer_
      println!("number was something other than zero");
  }
  
  // reassign, not mutation
  let number = 6;
  if number % 4 == 0 {
      println!("number is divisible by 4");
  } else if number % 3 == 0 {
      println!("number is divisible by 3");
  } else if number % 2 == 0 {
      println!("number is divisible by 2");
  } else {
      println!("number is not divisible by 4, 3, or 2");
  }

  let condition = true;
  let number = if condition { 5 } else { 6 };
  println!("The value of number is: {number}");
}

///

fn loops() {
  let mut counter = 0;
  let result = loop {
    counter += 1;
    if counter == 10 {
        break counter * 2;
    }
  };
  println!("The counter value ({counter}) looped a result of: {result}");
  loop_a_label();
}

fn loop_a_label() {
  let mut count = 0;
  // specify a loop label on a loop that you can then use with break or continue
  //  to specify that those keywords apply to the labeled loop instead of the innermost loop
  'counting_up: loop {
      println!("count = {count}");
      let mut remaining = 10;
      loop {
          println!("remaining = {remaining}");
          if remaining == 9 {
              break;
          }
          if count == 2 {
              break 'counting_up;
          }
          remaining -= 1;
      }
      count += 1;
  }
  println!("End count = {count}");
  conditional_loops()
}

fn conditional_loops() {
  println!("WHILE LOOP");
  let mut number = 3;
  while number != 0 {
    println!("{number}!");
    number -= 1;
  }
  println!("END WHILE LOOP");

  println!("FOR LOOP (arr)");
  let a = [10, 20, 30, 40, 50];
  for element in a {
    println!("the value is: {element}");
  }
  println!("END FOR LOOP");

  println!("FOR LOOP (range)");
  
  for rng_num in (1..20).rev() {
    println!("static range: {rng_num}");
  }

  for rng_num in (1..a.len()).rev() {
    let indexed_a = a[rng_num];
    println!("dynamic range: a[{rng_num}] = {indexed_a}");
  }
  println!("END FOR LOOP");
}