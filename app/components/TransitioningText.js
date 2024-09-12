'use client'

import React, { useState, useEffect } from 'react'
import styles from './TransitioningText.module.css'

const words = ['Find', 'Build', 'Explore']
const finalSentence = ['Find.', 'Build.', 'Explore', 'Together']

const TransitioningText = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFinalSentence, setShowFinalSentence] = useState(false)
  const [revealedLetters, setRevealedLetters] = useState(0)

  useEffect(() => {
    if (currentIndex < words.length) {
      const timer = setTimeout(() => {
        setCurrentIndex(prevIndex => prevIndex + 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (!showFinalSentence) {
      const timer = setTimeout(() => {
        setShowFinalSentence(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, showFinalSentence])

  useEffect(() => {
    if (showFinalSentence && revealedLetters < finalSentence.join(' ').length) {
      const timer = setTimeout(() => {
        setRevealedLetters(prev => prev + 1)
      }, 40)
      return () => clearTimeout(timer)
    }
  }, [showFinalSentence, revealedLetters])

  if (showFinalSentence) {
    return (
      <p className={`text-xl text-holly ${styles.magicContainer}`}>
        {finalSentence.map((word, wordIndex) => (
          <React.Fragment key={wordIndex}>
            {word.split('').map((letter, letterIndex) => (
              <span
                key={`${wordIndex}-${letterIndex}`}
                className={`${styles.magicLetter} ${
                  revealedLetters > finalSentence.slice(0, wordIndex).join(' ').length + letterIndex ? styles.revealed : ''
                } ${word === 'Together' ? 'font-bold text-claret' : ''}`}
              >
                {letter}
              </span>
            ))}
            {wordIndex < finalSentence.length - 1 && (
              <span
                className={`${styles.magicLetter} ${
                  revealedLetters > finalSentence.slice(0, wordIndex + 1).join(' ').length ? styles.revealed : ''
                }`}
              >
                &nbsp;
              </span>
            )}
          </React.Fragment>
        ))}
      </p>
    )
  }

  return (
    <p className="text-xl text-holly h-8">
      {currentIndex < words.length && (
        <>
          {words[currentIndex]}{' '}
          <span className="font-bold text-claret">together</span>
        </>
      )}
    </p>
  )
}

export default TransitioningText