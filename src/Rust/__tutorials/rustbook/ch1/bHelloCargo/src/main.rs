fn main() {
  println!("Hello, world!");
}

/*
cd <ROOT>
$ cargo build
$ ./target/debug/bHelloCargo
*/

// _OR_

/*
cd <ROOT>
$ cargo run
*/

// _OR_

/*
cd <ROOT>
$ cargo check
*/


//////
// RECAP:
/*
We can create a project using cargo new.
We can build a project using cargo build.
We can build and run a project in one step using cargo run.
We can build a project without producing a binary to check for errors using cargo check.
Instead of saving the result of the build in the same directory as our code, Cargo stores it in the target/debug directory.
*/