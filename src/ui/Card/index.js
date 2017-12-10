import React from 'react'

import styles from './_card.scss'

export function Card (props) {
  return (
    <div className={`${styles['mdl-card']} ${styles['mdl-shadow--2dp']}`}>
      {props.children}
    </div>
  )
}

export function CardAction (props) {
  return (
    <div className={`${styles['mdl-card__actions']} ${styles['mdl-card--border']}`}>
      {props.children}
    </div>
  )
}

export function CardText (props) {
  return (
    <div className={styles['mdl-card__supporting-text']}>
      {props.children}
    </div>
  )
}

export function CardTitle (props) {
  const {
    children,
    tag = 'h2'
  } = props

  const title = React.createElement(tag, {
    className: styles['mdl-card__title-text'],
    children
  })

  return (
    <div className={styles['mdl-card__title']}>
      {title}
    </div>
  )
}

export default Card
