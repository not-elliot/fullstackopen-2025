// const Hello = (props) => {
//   console.log(props)
//   return (
//     <div>
//       <p>Hello world and hello {props.name}, you are {props.age} years old</p>
//     </div>
//   )
// }

// const App = () => {

//   const now = new Date()
//   const a = 10
//   const b = 20
//   console.log(`${now}: ${a+b}`)
//   console.log('Hello from component')

//   const name = 'Frank'
//   const age = 44

//   const friends = [
//     {
//       name: "Hannes",
//       age: 29
//     },
//     {
//       name: "Birgitt",
//       age: 19
//     }
//   ]

//   return (
//     <>
//       <p>Hello world, it is {now.toString()}</p>
//       <p>
//         {a} plus {b} is {a + b}
//       </p>
//       <h1>Greeting</h1>
//       <Hello name='Steve' age={13+13} />
//       <Hello name='Andreas' age='13' />
//       <Hello name='Julia' age={13+2} />
//       <Hello name='Ludolf' age={13+55} />
//       <Hello name={name} age={age} />
//       <p>
//         My friends are: <br />
//           {friends[0].name} ({friends[0].age})
//           <br />
//           {friends[1].name} ({friends[1].age})
//       </p>
//       <p>or as a list from mapped array:</p>
//       <ul>
//         {friends.map(friend => <li>{friend.name} ({friend.age})</li>)}
//       </ul>
//     </>
//   )
// }

// export default App

// COMPONENT STATE, EVENT HANDLERS
// // const Hello = (props) => {
//   const Hello = ({ name, age }) => {

//   // const name = props.name
//   // const age = props.age

//   // const { name, age } = props

//   const bornYear = () => new Date().getFullYear() - age

//   return (
//     <div>
//       <p>
//         Hello {name}, you are {age} years old
//       </p>
//       <p>So you were probably born in {bornYear()}</p>
//     </div>
//   )
// }

// const App = ({ counter }) => {
//   const name = 'Peter'
//   const age = 10

//   return (
//     <div>
//       <h1>Greetings</h1>
//       <Hello name="Maya" age={26 + 10} />
//       <Hello name={name} age={age} />
//       <div>{counter}</div>
//     </div>
//   )
// }

// export default App

import { useState } from 'react'

const Display = ({ counter }) => <div>{counter}</div>
const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const History = ({ allClicks }) => {
  if(allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }
  return (
    <div>
      button press history: {allClicks.join(' ')}
    </div>
  )
}

const App = () => {

  const [counter, setCounter] = useState(0)
  console.log('rendering with counter value', counter)

  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)

  // const [clicks, setClicks] = useState({
  //   left: 0,
  //   right: 0
  // })

  const [allClicks, setAll] =useState([])
  const [total, setTotal] = useState(0)

  const [value, setValue] = useState(10)

  const increaseByOne = () => setCounter(counter + 1)
  const decreaseByOne = () => setCounter(counter - 1)
  const setToZero = () => setCounter(0)

  // const handleLeftClick = () => setClicks({ ...clicks, left: clicks.left + 1 })
  // const handleRightClick = () => setClicks({ ...clicks, right: clicks.right + 1 })

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    const updatedLeft = left + 1
    setLeft(updatedLeft)
    console.log('left after', left)
    setTotal(updatedLeft + right)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    const updatedRight = right + 1
    setRight(updatedRight)
    setTotal(left + updatedRight)
  }

  const hello = (who) => () => { console.log('hello world and', who) }

  const setToValue = (newValue) => () => { 
    console.log('value now', newValue)  // print the new value to console; setValue(who)
    setValue(newValue)
  }

  const setToValueDirect = (newValue) => setValue(newValue)

  return (
    <>
      {value}
      <Button onClick={hello('Mike')} text='Mike console' />
      <Button onClick={hello('Ingrid')} text='Ingrid console' />
      <Button onClick={hello('Hotbot')} text='Hotbot console' />
      <Button onClick={setToValue(1000)} text='thousand' />
      <Button onClick={setToValue(0)} text='reset' />
      <Button onClick={setToValue(value + 1)} text='increment' />
      <Button onClick={() => setToValueDirect(1000)} text='thousand direct' />
      <Button onClick={() => setToValueDirect(0)} text='reset direct' />
      <Button onClick={() => setToValueDirect(value + 1)} text='increment direct' />
      <br />
      <br />
      <Display counter={counter} />
      <Button onClick={increaseByOne} text='plus' />
      <Button onClick={setToZero} text='zero' />
      <Button onClick={decreaseByOne} text='minus' />
      <br />
      <br />
      <br />
      {left}
      {/* <button onClick={() => setLeft(left + 1)}>left</button>
      <button onClick={() => setRight(right + 1)}>right</button> */}
      {/* <button onClick={handleLeftClick}>left</button> */}
      {/* <button onClick={handleRightClick}>right</button> */}
      <Button onClick={handleLeftClick} text='left' />
      <Button onClick={handleRightClick} text='right' />
      {right}
      {/* {clicks.left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {clicks.right} */}
      <History allClicks={allClicks} />
      <p>total {total}</p>
    </>
  )
}

export default App