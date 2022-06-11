import prisma from '@util/prisma'
import { Prisma } from '@prisma/client'
import parseQuestions from '@util/parseQuestion'

const questions = `1. TF: Tigers live in the jungle? A:True%|B:False
2. What is the largest rain forest in the world? Amazon rain forest%
3. What is the largest river in the world? The Amazon River%
4. TF: The Amazon rain forest is in South America. A:True%|B:False
5. TF: Jungles and rain forests are the same thing. A:True|B:False%
6. What percentage of the world is covered in jungle? A:4|B:6%|C:15|D:30.
7. How many layers of growth are in a jungle? 4%
8. TF: Over half the worlds animal and plant species live in jungles and rain forests. A:True%|B:False
9. Jungles are typically not found close to the equator. A:True|B:False%
10. What percentage of bird species are found in the amazon rain forest? A:15|B:33%|C:48|D: 62
11. TF: Some rain forests can receive over 14 ft of rain per year. A:True%|B:False
12. What percentage of the world's oxygen is produced by rain forests? A:28%|B:32|C:52|D:60
13. How old is the oldest rain forest found by paleontologists? 252 million years old%
14. Rainforests are found on six of the seven continents. Which one does not have a rainforest? Antarctica%
15. How many kinds of rain forest are there? 2, temperate and tropical%
16. What type of animal is Rikki-Tikki-Tavi from “The Jungle Book”? Mongoose%
17. What large animals do Komodo dragons eat? Water Buffalo%
18. Spider monkeys have a prehensile tail, meaning they can do what with their tail? Grab branches%
19. What is the lifespan of the macaw, an kind of wild parrot? 60 years%
20. Each year, almost a million people travel to the Andes mountains to visit which cultural site in Peru? Machu Pichu%
21. In the Sagano Forest in Japan, bamboo grows at how many inches per day? A:1|B:12|C:40%|D:60
22. TF: You can find bananas, lemons, mangoes, and avocados in the rain forest. A:True%|B:False
23. What large black cat lives in a jungle? Jaguar or puma%
24. What fearsome, carnivorous fish lives in the Amazon River? Piranha%
25. What kind of large snake lives in the rain forest? Boa or Boa Constrictor%
26. What extremely large mammal can be found living in the jungles of Africa and Asia? Elephants%
27. What small reptile has the ability to change its color pattern to match its surroundings? Chameleon %
28. What is the name of the largest rodent in the world who makes its home in the Amazon Rainforest? The Capybara%
29. What famous Disney character was raised by Gorillas in a Jungle? Tarzan%
30. Which mammal is known to have the most powerful bite in the world? The Hippopotamus%
31. Which animal is known to spend 90% of its day sleeping? The Koala%
32. What color is the tongue of a giraffe? Purple%
33. Which animal's stripes are on its skin as well as its fur? The Tiger%
34. How long does it take a sloth to digest food? Two weeks%
35. What is the only mammal that's able to fly? A bat%
36. What are the horns of a rhinoceros made of? Hair%
37. What is the only mammal that cannot jump? Elephant%
38. What animal eats mostly bamboo? The Panda%
39. Which animal can stand on its tail? Kangaroo%
40. What is the tallest animal in the world? The Giraffe%
41. What do snakes use to smell? Their tongue%
42. What kind of animal is the Komodo dragon? A Lizard%
43. Are most reptiles cold blooded or warm blooded? Cold-blooded%
44. What's the name of the largest snake in the world? Anaconda%
45. Nearly all amphibians, such as frogs, undergo a significant change as the mature. What is this process called? Metamorphosis%
46. TF: Oklahoma is considered a rain forest. A:True|B:False%
47. TF: At full speed, Cheetahs spend more tie in the air than on the ground. A:True%|B:False
48. Who does more of the hunting, male or female lions? A:Male|B:Female%
49. How long does a wild giraffe sleep each day? A:30 min%|B: 2 hours |C:6 hours|D:12 hours
50. What is the theme of this year's competition? Jungle Adventure%`

const seed = async () => {
  const data = parseQuestions(
    questions
  ) as Prisma.Enumerable<Prisma.QuestionsCreateManyInput>

  await prisma.questions.deleteMany({})

  await prisma.questions.createMany({ data })

  console.log('Seeded')
}

if (require.main === module) {
  seed()
}

export default seed
