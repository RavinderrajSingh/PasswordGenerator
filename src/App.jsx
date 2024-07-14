import React, { useCallback, useEffect, useRef, useState } from 'react'

function App() {
  let [password, SetPassword] = useState('');
  let [passLength, setPassLength] = useState(8);
  let [useNumbers, setUseNumbers] = useState(true);
  let [useCharacters, setUseCharacters] = useState(true);
  let [buttonText, setButtonText] = useState('Copy');
  const passwordRef = useRef(null);
  const defaultButtonColor = '#ea580c';
  let [buttonColor, setButtonCOlor] = useState(defaultButtonColor);
  let [copyPassLength, setCopyPassLength] = useState(passLength);

  const copiedButtonColor = '#3ba30e';

  function generatePassword() {
    setButtonText('Copy');
    setButtonCOlor(defaultButtonColor);
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    let charcs = '!@#$%^&*()+-=?^_`{}'
    let numbers = '0123456789'
    let result = '';

    if (useNumbers) str += numbers;
    if (useCharacters) str += charcs;

    for (let i = 0; i < passLength; i++) {
      result += str[Math.floor(Math.random() * str.length)];
    }

    // regenerate password if it doesn't meet the requirements

    return result;

  }

  // for caching purposes using usecallback
  const validatePassword = useCallback(() => {
    let newPassword = generatePassword();


    let haveNumbers = /\d/.test(newPassword); // to check for numbers
    let haveCharacters = /[^a-zA-Z0-9\s]/.test(newPassword); // to check if it contains characters

    // if the password doesn't meet the requirements, generate a new one
    while (useNumbers && !haveNumbers) {
      newPassword = generatePassword();
      haveNumbers = /\d/.test(newPassword);

    }

    // if the password doesn't have any characters
    while (useCharacters && !haveCharacters) {
      newPassword = generatePassword();
      haveCharacters = /[^a-zA-Z0-9\s]/.test(newPassword);
    }

    SetPassword(newPassword);

  }, [useNumbers, useCharacters, passLength, SetPassword])


  const CopyPasswordToClipboard = useCallback(() => {

    setButtonCOlor(copiedButtonColor);

    let copypass = password.slice(0, copyPassLength);
    console.log(copypass);
    setButtonText('Copied ' + copypass.length + " characters");
    setCopyPassLength(copypass.length);
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, copyPassLength);
    window.navigator.clipboard.writeText(copypass);

    setTimeout(() => {
      setButtonText('Copy');
      setButtonCOlor(defaultButtonColor);
    }, 1000); // it will revert button text to copy after 200 milliseconds or 2 seconds

  }, [password, copyPassLength, SetPassword]);


  useEffect(() => {
    validatePassword();
    setCopyPassLength(passLength);
  }, [passLength, useNumbers, useCharacters, validatePassword]);



  return (
    <div className='h-screen w-full flex justify-evenly items-center flex-col  '>

      <div className='text-5xl text-white'>
        Random Password Generator
      </div>

      <div className='w-[70%] h-auto p-3 bg-zinc-600 rounded-lg flex flex-col'>


        {/* display and copy button */}
        <div className='flex justify-center items-center m-2'>

          {/* display field */}
          <input
            type="text"
            value={password}
            placeholder='password'
            readOnly
            ref={passwordRef}
            className=' p-2 rounded-lg w-[70%] outline-none border-none text-xl text-white bg-gray-700'
          />
          {/* Copy button */}
          <div className='flex flex-col items-center '>
            <button
              className='p-2 rounded-md text-xl mx-5 mt-2 px-10  text-white
              bg-[#171826] hover:bg-[#696b82] '
              onClick={() => {
                console.log("click")
                validatePassword();
              }}>  ReGenerate
            </button>

            <button
              className='p-2 rounded-md text-xl mx-5 mt-2 px-10  text-white hover:bg-teal-600 hover:text-black'
              style={{ backgroundColor: buttonColor }}
              onClick={() => {
                CopyPasswordToClipboard();
              }}>  {buttonText}
            </button>
          </div>


        </div>


        {/* Parameters */}
        <div className='flex justify-evenly items-center m-2 '>

          {/* sliders */}

          <div>

            {/* pass length slider */}
            <div>
              <input
                type="range"
                value={passLength}
                min='6'
                max='100'
                className='range-Slider w-[15rem]'
                onChange={(e) => {
                  setPassLength(e.target.value)
                }}
              />
              <label className='text-white mx-3'>Pass Length : {passLength}</label>
            </div>


            {/* copy pass length slider */}
            <div>
              <input
                type="range"
                value={copyPassLength}
                min='1'
                max={passLength}
                className='range-Slider w-[15rem]'
                onChange={(e) => {
                  setCopyPassLength(e.target.value)
                }}
              />
              <label className='text-white mx-3'>Copy Length : {copyPassLength}</label>
            </div>

          </div>


          {/* useNumbers checkbutton */}
          <div className='flex items-center justify-center'>
            <input
              className='
              h-4 w-4'
              type="checkbox"
              defaultChecked={useNumbers}
              onChange={() => {
                setUseNumbers((prev) => !prev)

              }}
            />
            <label className='text-white mx-3'>Use Numbers</label>
          </div>

          {/* useCharacters checkbutton */}
          <div className='flex items-center justify-center'>
            <input
              className='
              h-4 w-4'
              type="checkbox"
              defaultChecked={useCharacters}
              onChange={() => {
                setUseCharacters((prev) => !prev)

              }}
            />
            <label className='text-white mx-3'>Use Special Character </label>
          </div>


        </div>


      </div>


    </div >
  )
}

export default App