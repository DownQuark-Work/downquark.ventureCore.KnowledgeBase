use rand::Rng;
use std::cmp::Ordering;
use std::io;

fn main() {
  println!("Guess the number!");

  let secret_number = rand::thread_rng().gen_range(1..=100);
  println!("The secret number is: {secret_number}");

  loop {
    println!("Please input your guess.");

    let mut guess = String::new();

    io::stdin()
      .read_line(&mut guess) // See _~!~_
      .expect("Failed to read line");
    // without `use std::io` we can use:
      // std::io::stdin() - `use` is like an alias?  

    // let guessThrow: u32 = guess.trim().parse().expect("Please type a number!"); // <-- THROW
      
    let guess: u32 = match guess.trim().parse() { // typecast
      Ok(num) => num,
      Err(_) => continue, // <-- graceful
    };

    println!("You guessed: {guess}");

    match guess.cmp(&secret_number) {
      Ordering::Less => println!("Too small!"),
      Ordering::Greater => println!("Too big!"),
      Ordering::Equal => {
        println!("You win!");
        break;
    },
    }
  }
}

/* ~!~
The `&` indicates that this argument is a reference,
which gives you a way to let multiple parts of your code access
one piece of data without needing to copy that data into memory multiple times.
*/

/* along the lines of log(' hi %s', varName):
let x = 5;
let y = 10;

println!("x = {x} and y + 2 = {}", y + 2);
*/