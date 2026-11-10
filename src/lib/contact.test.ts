import { expect, test } from 'bun:test'
import { mailtoHref, validateContact } from './contact'

const ok = { name: 'Amina', email: 'amina@dukaletu.co.ke', phone: '', topic: 'Getting started', message: 'Hello' }

test('a complete message has no errors', () => {
  expect(validateContact(ok)).toEqual({})
})

test.each([
  [{ ...ok, name: ' ' }, { name: 'Enter your name.' }],
  [{ ...ok, email: '' }, { email: 'Enter your email address.' }],
  [{ ...ok, email: 'amina@duka' }, { email: 'Use the form name@example.com.' }],
  [{ ...ok, message: '' }, { message: 'Write your message.' }],
])('errors for %j', (fields, expected) => {
  expect(validateContact(fields)).toEqual(expected)
})

test('the mailto link carries the topic as subject and the sender in the body', () => {
  const href = mailtoHref('help@example.com', { ...ok, phone: '0700000000' })
  expect(href.startsWith('mailto:help@example.com?subject=Getting%20started&body=')).toBe(true)
  expect(decodeURIComponent(href)).toContain('From: Amina <amina@dukaletu.co.ke>')
  expect(decodeURIComponent(href)).toContain('Phone: 0700000000')
})
