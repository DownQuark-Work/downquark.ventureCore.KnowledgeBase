# [Ownership](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html)
> Ownership is Rust’s most unique feature and has deep implications for the rest of the language. It enables Rust to make memory safety guarantees without needing a garbage collector, so it’s important to understand how ownership works.

## What Is Ownership?
_Ownership_ is a set of rules that govern how a Rust program manages memory.
- in rust memory is managed through a system of ownership with a set of rules that the compiler checks
  - If any of the rules are violated, the program won’t compile
  - None of the features of ownership will slow down your program while it’s running.

## Stack & Heap
1. The stack stores values in the order it gets them and removes the values in the opposite order.
    - `last in, first out`
1. The heap is less organized: when you put data on the heap, you request a certain amount of space. The memory allocator finds an empty spot in the heap that is big enough, marks it as being in use, and returns a pointer, which is the address of that location.
    - `allocating on the heap`
    - Because the pointer to the heap is a known, fixed size, you can store the pointer on the stack, but when you want the actual data, you must follow the pointer.
    > Think of being seated at a restaurant. When you enter, you state the number of people in your group, and the host finds an empty table that fits everyone and leads you there. If someone in your group comes late, they can ask where you’ve been seated to find you.
1. Pushing to the stack is faster than allocating on the heap because the allocator never has to search for a place to store new data; that location is always at the top of the stack.
    - Allocating space on the heap requires more work because the allocator must first find a big enough space to hold the data and then perform bookkeeping to prepare for the next allocation.
1. Accessing data in the heap is slower than accessing data on the stack because you have to follow a pointer to get there.
    > A server at a restaurant taking orders from many tables. It’s most efficient to get all the orders at one table before moving on to the next table. Taking an order from table A, then an order from table B, then one from A again, and then one from B again would be a much slower process
    - By the same token, a processor can do its job better if it works on data that’s close to other data (as it is on the stack) rather than farther away (as it can be on the heap).
1. When your code calls a function, the values passed into the function (including, potentially, pointers to data on the heap) and the function’s local variables get pushed onto the stack. When the function is over, those values get popped off the stack.
1. Keeping track of what parts of code are using what data on the heap, minimizing the amount of duplicate data on the heap, and cleaning up unused data on the heap so you don’t run out of space are all problems that ownership addresses.
    - Understand ownership, and you won’t need to think about the stack and the heap very often, but knowing that the main purpose of ownership is to manage heap data can help explain why it works the way it does.
---
## Rules
- Each value in Rust has an owner.
- There can only be one owner at a time.
- When the owner goes out of scope, the value will be dropped.

### String Type
A hardcoded, immutable string is a _string literal_.
Otherwise, use the `String` type
> This type manages data allocated on the heap and as such is able to store an amount of text that is unknown to us at compile time.

Create a String from a string literal using the from function, like so:
- `let s = String::from("hello");`
> The double colon `::` operator allows us to namespace this particular from function under the `String` type rather than using some sort of name like `string_from`.
_**Mutable**_
```rust
let mut s = String::from("hello");
s.push_str(", world!"); // push_str() appends a literal to a String
println!("{}", s); // This will print `hello, world!`
```

## Memory and Allocation
1. String literals are fast and efficient. 
    - In the case of a string literal, we know the contents at compile time, so the text is hardcoded directly into the final executable.
    - Above poperties only come from string literal’s immutability
      - Can’t put a blob of memory into the binary for each piece of text whose size is unknown at compile time and whose size might change while running the program.
1. `String` type - supports a mutable, growable piece of text
    - Allocate an amount of memory on the heap to hold the contents. 
      - Size/amount is unknown at compile time
    - Memory must be requested from the memory allocator at runtime.
      - `String::from` makes the memory request
    - Requires returning this memory to the allocator when finished with the String.
### Garbage Collection
In languages with a garbage collector (**GC**), the **GC** keeps track of and cleans up memory that isn’t being used anymore, and we don’t need to think about it. In most languages without a **GC**, it’s our responsibility to identify when memory is no longer being used and to call code to explicitly free it, just as we did to request it. Doing this correctly has historically been a difficult programming problem. If we forget, we’ll waste memory. If we do it too early, we’ll have an invalid variable. If we do it twice, that’s a bug too.
- Need to pair exactly one `allocate` with exactly one `free`.

## _**Rust GC**_:
The memory is automatically returned once the variable that owns it goes out of scope.
```rust
{
  let s = String::from("hello"); // s is valid from this point forward
  // do stuff with s
} // this scope is now over, and s is no
// longer valid
```
> When a variable goes out of scope, Rust calls a special function for us. This function is called `drop`, and it’s where the author of String can put the code to return the memory. Rust calls `drop` automatically at the closing curly bracket.

### _⚠️_
> It may seem simple right now, but the behavior of code can be unexpected in more complicated situations when we want to have multiple variables use the data we’ve allocated on the heap. Let’s explore some of those situations now.

## Variables and Data Interacting with Move

String Literals|`String` type
-|-
![Duplicated](https://doc.rust-lang.org/book/img/trpl04-03.svg)|![Pointed](https://doc.rust-lang.org/book/img/trpl04-04.svg)
```rust
fn memory_with_move() {
  let string_literal = "stringy";
  let string_literal_copy = string_literal;
    // 👆 assigning new var to existing string literal _**DUPLICATES**_ memory in heap
  println!("{}, does NOT throw", string_literal);

  let string_type = String::from("mock-dynamic-text");
  let string_type_copy = string_type;
    // 👆 assigning new var to existing `String` type _**POINTS**_ new var to memory in heap
      // _**AND**_ invalidates original var in memory
    println!("{}, does NOT throw", string_type_copy);
    // println!("{}, `string_type` DOES throw", string_type);
    println!("{{}}`string_type` WOULD throw");
    println!("TRY: `% rustc --explain E0382`")
}
```
## Ownership and Functions
The mechanics of passing a value to a function are similar to those when assigning a value to a variable. Passing a variable to a function will move or copy, just as assignment does.
## Return Values and Scope
Returning values can also transfer ownership. 

---
## Retaining Ownership
> The ownership of a variable follows the same pattern every time: assigning a value to another variable moves it. When a variable that includes data on the heap goes out of scope, the value will be cleaned up by drop unless ownership of the data has been moved to another variable.

Taking ownership and then returning ownership with every function is a bit tedious
- Rust allows multiple return values using a tuple
  - A lot of work for a concept that should be common.

Rust has a feature for using a value without transferring ownership: `reference`

---
## Reference
>  A reference is like a pointer in that it’s an address we can follow to access the data stored at that address;
> - that data is owned by some other variable.
>
> Unlike a pointer, a reference is guaranteed to point to a valid value of a particular type for the life of that reference.
- define as normal:
  - `let variable_name = String::from("reference variable");`
- pass as reference argument with _ampersand_ character:
  - `doFunction(&variable_name);`
- define as reference property with _ampersand_ character:
  - `fn doFunction(s: &String) -> usize { s.len(); }`

These ampersands represent references, and they allow you to refer to some value without taking ownership of it.

`&String s` pointing at `String s1`|
-|
![refence heap concept](https://doc.rust-lang.org/book/img/trpl04-05.svg)|

> Note: The opposite of referencing by using `&` is dereferencing, which is accomplished with the dereference operator, `*`

### Mutable References
Just as variables are immutable by default, so are references.
To make muable:
- define as mutable:
  - `let mut variable_name = String::from("reference variable");`
- pass as mutable reference:
  - `doFunction(&mut variable_name);`
- define as mutable reference property:
  - `fn doFunction(s: &mut String) -> usize { s.len(); }`

> CAVEAT: Mutable references have one big restriction: if you have a mutable reference to a value, you can have no other references to that value.

The benefit of having this restriction is that Rust can prevent data races at compile time.

A _data race_ is similar to a race condition and happens when these three behaviors occur:
- Two or more pointers access the same data at the same time.
- At least one of the pointers is being used to write to the data.
- There’s no mechanism being used to synchronize access to the data.

### Dangling References
> A pointer that references a location in memory that may have been given to someone else

Rust compiler guarantees references will never be dangling.
The compiler will `THROW` when the data will go out of scope before the reference to the data does.

## Recap
- At any given time, you can have either one mutable reference or any number of immutable references.
- References must always be valid.

## Slice Types
> Slices let you reference a contiguous sequence of elements in a collection rather than the whole collection. A slice is a kind of reference, so it does not have ownership.
### String Slices
A string slice is a reference to part of a `String` with syntax:
```rust
let s = String::from("hello world");
let hello = &s[0..5];
let world = &s[6..11];
```
String slice referring to part of a String|
-|
![string slice](https://doc.rust-lang.org/book/img/trpl04-06.svg)|
### Other Slices
```rust
let a = [1, 2, 3, 4, 5];
let a_slice = &a[1..3];
assert_eq!(a_slice, &[2, 3]);
```