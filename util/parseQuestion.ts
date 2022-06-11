const parseQuestions = (questions: string) => {
  const unparsedQuestions = questions.split('\n')

  const parsedQuestions = unparsedQuestions.map((question) => {
    let content = undefined;
    if (question.includes('?')) {
      content = question.match(/\d+\. (.*?[?]) (.*)/)
    } else {
      content = question.match(/\d+\. (.*?[.]) (.*)/)
    }

    //const choices = question.match()

    if (!content) return

    let choices = content[2].split('|')
    let correctAnswer = ''

    choices = choices.filter((choice) => {
      if (choice.includes('%')) {
        correctAnswer = choice.replace('%', '')

        if (choice.includes(':')) return true

        return false
      }

      return true
    })

    choices = choices.map((choice) => choice.replace('%', ''))

    return {
      content: content[1],
      choices: choices.join('|'),
      correctAnswer: correctAnswer,
    }
  })

  return parsedQuestions
}

export default parseQuestions