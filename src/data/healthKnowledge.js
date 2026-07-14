export const BMI_DISCLAIMER =
  'BMI is a general screening tool and does not directly measure body fat, muscle mass, bone density, or overall health.'

export const categorySuggestions = {
  Training: [
    'How many days should I train?',
    'How long should a workout be?',
    'What is progressive overload?',
    'Should I do cardio before or after weights?',
  ],
  Nutrition: [
    'How much protein do I need?',
    'What should I eat before a workout?',
    'Can I build muscle on vegetarian food?',
    'What are healthy carbs?',
  ],
  Walking: [
    'How many steps should I walk?',
    'Is 10,000 steps necessary?',
    'How should beginners start walking?',
    'Is walking after meals useful?',
  ],
  Hydration: [
    'How much water should I drink?',
    'Should I drink water during a workout?',
    'What are signs of dehydration?',
    'Do I need electrolyte drinks?',
  ],
  Recovery: [
    'Why are my muscles sore?',
    'Can I train while sore?',
    'How much sleep do I need?',
    'What should I do on a rest day?',
  ],
  'Beginner Guide': [
    'I am a beginner. How do I start?',
    'What should I do in my first week?',
    'How much weight should I lift?',
    'Should I use machines or free weights?',
  ],
  'Ask Coach': [
    'What is BMI?',
    'How do I recover faster?',
    'Why is proper form important?',
    'Is walking good for fat loss?',
  ],
}

const response = (main, steps, links = []) => ({ main, steps, links })

export const healthIntents = [
  {
    id: 'training-days', category: 'Training', phrases: ['how many days', 'days should i train', 'training frequency'],
    ...response('Most beginners do well with 2–4 strength-training days each week. The best frequency is one you can recover from and follow consistently; each major muscle group can usually be trained about twice weekly with rest between hard sessions.', ['Choose 2–3 training days this week', 'Use full-body or simple split sessions', 'Record performance and recovery'], ['/workout']),
  },
  {
    id: 'training-chest', category: 'Training', phrases: ['best for chest', 'chest exercise', 'exercise for chest'],
    ...response('There is no single best chest exercise. A press such as a push-up, machine chest press, dumbbell press, or bench press builds the main pressing pattern; a fly can add variety. Choose an option you can perform through a comfortable range with control.', ['Pick one press you can perform safely', 'Start with light, controlled repetitions', 'Use Exercise Rankings to compare options'], ['/workout', '/workout/exercises']),
  },
  {
    id: 'training-heavy', category: 'Training', phrases: ['beginner lift heavy', 'lift heavy', 'heavy weights'],
    ...response('Beginners should first use a manageable load that allows stable technique and controlled repetitions. “Heavy” is relative: add weight only after you can complete your target repetitions without form breaking down.', ['Learn the movement with a light load', 'Leave a few good repetitions in reserve', 'Increase in small steps'], ['/workout/exercises']),
  },
  {
    id: 'training-duration', category: 'Training', phrases: ['how long should', 'workout duration', 'long workout'],
    ...response('A focused workout often takes about 30–75 minutes, but quality matters more than duration. Your plan, rest periods, experience, and available time determine the right length.', ['Plan 4–6 purposeful exercises', 'Set a realistic session time', 'Finish before technique and focus decline'], ['/workout']),
  },
  {
    id: 'rest-sets', category: 'Training', phrases: ['rest between sets', 'between sets'],
    ...response('Rest long enough to perform the next set with good technique. Around 1–2 minutes can suit lighter accessory work, while demanding strength sets may need 2–4 minutes. Adjust based on breathing and performance.', ['Time your rest for one workout', 'Start the next set when you feel ready', 'Extend rest if form or repetitions drop sharply']),
  },
  {
    id: 'same-muscle', category: 'Training', phrases: ['same muscle every day', 'same muscles every day', 'train muscle daily'],
    ...response('Hard training for the same muscle every day can limit recovery. Most people benefit from roughly 48 hours before training that muscle hard again, although light technique or mobility work may be different.', ['Alternate muscle groups or use rest days', 'Track soreness and performance', 'Reduce frequency if recovery worsens'], ['/workout']),
  },
  {
    id: 'cardio-order', category: 'Training', phrases: ['cardio before or after', 'cardio after weights', 'cardio before weights'],
    ...response('Do the activity most important to your goal first. For strength or muscle gain, weights usually come before longer cardio; for endurance performance, cardio may come first. A short easy warm-up before weights is still useful.', ['Choose today’s main goal', 'Warm up for 5–10 easy minutes', 'Keep the second activity manageable']),
  },
  {
    id: 'exercise-count', category: 'Training', phrases: ['exercises per muscle', 'how many exercises', 'number of exercises'],
    ...response('One to three well-chosen exercises per muscle group in a session is often enough. Total weekly sets, effort, technique, and recovery matter more than collecting many similar movements.', ['Choose one main movement first', 'Add one accessory only if useful', 'Track weekly sets and recovery'], ['/workout/exercises']),
  },
  {
    id: 'progressive-overload', category: 'Training', phrases: ['progressive overload', 'increase weight'],
    ...response('Progressive overload means gradually increasing the challenge as your body adapts. You can add a little weight, perform more controlled repetitions, improve range of motion, add a set, or improve technique—not all at once.', ['Record one key exercise', 'Progress only one variable at a time', 'Keep technique consistent while progressing'], ['/workout']),
  },
  {
    id: 'proper-form', category: 'Training', phrases: ['proper form', 'form important', 'technique important'],
    ...response('Proper form helps you train the intended movement consistently, control the load, and notice when fatigue changes your technique. It also makes progress easier to compare over time.', ['Use a lighter practice set', 'Move through a comfortable range', 'Stop the set when control breaks down'], ['/workout/exercises']),
  },
  {
    id: 'protein', category: 'Nutrition', phrases: ['how much protein', 'protein need', 'protein per day'],
    ...response('Protein needs vary with body size, activity, age, and goals. A practical general range for active adults is about 1.2–1.6 g per kg of body weight daily, spread across meals; individual medical needs can differ.', ['Include a protein source in each main meal', 'Review your intake on the Diet page', 'Ask a dietitian for individual needs'], ['/diet', '/diet-report']),
  },
  {
    id: 'pre-workout-food', category: 'Nutrition', phrases: ['eat before workout', 'pre workout food', 'before a workout'],
    ...response('Before training, choose an easy-to-digest meal or snack with carbohydrates and some protein. Examples include fruit with yogurt, oats with milk, or rice with a lean protein. Larger meals generally need more digestion time.', ['Choose a familiar food', 'Eat a light snack 1–2 hours before', 'Note which foods feel comfortable'], ['/diet']),
  },
  {
    id: 'post-workout-food', category: 'Nutrition', phrases: ['eat after workout', 'post workout food', 'after a workout'],
    ...response('After training, a normal balanced meal with protein, carbohydrates, vegetables or fruit, and fluids supports recovery. A special supplement is not required when a suitable meal is available.', ['Plan your next balanced meal', 'Include protein and carbohydrates', 'Replace fluids after training'], ['/diet', '/diet-report']),
  },
  {
    id: 'rice-weight-loss', category: 'Nutrition', phrases: ['rice bad', 'rice for weight loss', 'rice weight loss'],
    ...response('Rice is not automatically bad for weight loss. Overall energy intake, portions, food quality, and consistency matter more. Pair a suitable portion with protein and vegetables for a filling meal.', ['Keep a consistent rice portion', 'Add protein and vegetables', 'Review the whole day in Diet Report'], ['/diet', '/diet-report']),
  },
  {
    id: 'egg-chicken', category: 'Nutrition', phrases: ['egg or chicken', 'eggs or chicken'],
    ...response('Both eggs and chicken can provide high-quality protein. Eggs also provide fats and micronutrients, while skinless chicken is often a leaner concentrated protein source. Choose based on preference, budget, dietary pattern, and the rest of your meal.', ['Choose the option you enjoy and tolerate', 'Consider the full meal, not one food', 'Vary protein sources through the week'], ['/diet']),
  },
  {
    id: 'paneer-tofu', category: 'Nutrition', phrases: ['paneer or tofu', 'tofu or paneer'],
    ...response('Both can support a balanced diet. Paneer provides dairy protein and usually more saturated fat; tofu provides soy protein and is often lighter. Nutrition varies by product and serving size.', ['Check the product label', 'Choose a portion that fits your meal', 'Rotate plant and dairy proteins if suitable'], ['/diet']),
  },
  {
    id: 'meal-frequency', category: 'Nutrition', phrases: ['how many meals', 'meals should i eat', 'meal frequency'],
    ...response('There is no universal ideal number of meals. Two, three, or more meals can work when they provide enough nutrition, suit your schedule, and help you manage hunger and energy.', ['Choose a repeatable meal schedule', 'Include protein and produce regularly', 'Use Diet Report to review patterns'], ['/diet-report']),
  },
  {
    id: 'vegetarian-muscle', category: 'Nutrition', phrases: ['vegetarian food', 'vegetarian muscle', 'build muscle vegetarian'],
    ...response('Muscle can be built with a vegetarian diet when total energy and protein are sufficient. Useful options include dairy, soy, lentils, beans, peas, and combinations of grains and legumes.', ['List three protein foods you enjoy', 'Spread them across your meals', 'Track intake and training consistently'], ['/diet', '/diet-report']),
  },
  {
    id: 'healthy-carbs', category: 'Nutrition', phrases: ['healthy carbs', 'good carbs', 'carbohydrates healthy'],
    ...response('Useful carbohydrate sources include oats, rice, whole grains, potatoes, fruit, beans, and lentils. Less-processed choices often add fibre and micronutrients, but portions and your total eating pattern still matter.', ['Add one high-fibre carb today', 'Pair it with protein', 'Compare choices on the Diet page'], ['/diet']),
  },
  {
    id: 'walking-steps', category: 'Walking', phrases: ['how many steps', 'steps should i walk', 'daily steps'],
    ...response('There is no single step target for everyone. Your current baseline matters: start with what is comfortable, then consider adding roughly 500–1,000 daily steps over time if you recover well.', ['Check your baseline in Pedometer', 'Choose a manageable increase', 'Review progress after one week'], ['/pedometer']),
  },
  {
    id: 'ten-thousand', category: 'Walking', phrases: ['10000 steps', '10,000 steps', 'ten thousand steps'],
    ...response('10,000 steps is a popular goal, not a universal requirement. Health benefits can begin below that level, and a smaller sustainable increase from your baseline is valuable.', ['Measure your normal daily steps', 'Add a short walk you can repeat', 'Increase only when it feels sustainable'], ['/pedometer']),
  },
  {
    id: 'walking-fat-loss', category: 'Walking', phrases: ['walking good for fat', 'walking for fat loss', 'walking weight loss'],
    ...response('Walking can support fat loss by increasing activity, but results also depend on overall food intake, sleep, and consistency. It is joint-friendly for many people and easier to repeat than intense exercise.', ['Schedule a 10–20 minute walk', 'Keep a pace you can sustain', 'Track both walking and eating patterns'], ['/pedometer', '/diet-report']),
  },
  {
    id: 'walking-cardio', category: 'Walking', phrases: ['walking replace cardio', 'walking cardio'],
    ...response('Brisk walking is a form of cardio and may be enough for some general activity goals. Higher fitness or sport goals may also benefit from more challenging cardio, progressed gradually.', ['Try a brisk conversational pace', 'Track duration and how you feel', 'Add intensity gradually if appropriate'], ['/pedometer']),
  },
  {
    id: 'low-steps', category: 'Walking', phrases: ['step count low', 'low step count', 'steps are low'],
    ...response('A low count can reflect a less active day, phone placement, motion permission, or device limitations. Keep the device with you and check that tracking is enabled; focus on trends rather than one reading.', ['Check Pedometer permission and device placement', 'Take a short known walk', 'Compare several days'], ['/pedometer']),
  },
  {
    id: 'beginner-walking', category: 'Walking', phrases: ['beginner start walking', 'start walking', 'new to walking'],
    ...response('Begin with 5–15 comfortable minutes on a safe, level route and repeat it regularly. Increase time or pace gradually—not both at once. Stop for chest pain, faintness, severe breathlessness, or sharp pain.', ['Choose a safe 10-minute route', 'Wear comfortable footwear', 'Add a few minutes only when ready'], ['/pedometer']),
  },
  {
    id: 'after-meal-walk', category: 'Walking', phrases: ['walking after meals', 'walk after meal', 'walking after food'],
    ...response('A gentle walk after a meal can add daily movement and may feel comfortable for many people. Keep it easy, especially after a large meal, and stop if you feel unwell.', ['Try 5–10 easy minutes', 'Avoid a hard pace immediately after eating', 'Notice comfort and energy']),
  },
  {
    id: 'water-amount', category: 'Hydration', phrases: ['how much water', 'water should i drink', 'water per day'],
    ...response('Water needs vary with body size, climate, activity, food, pregnancy, and health conditions. Drink regularly, use thirst as a guide, and aim for pale-yellow urine rather than forcing one exact amount.', ['Carry water during the day', 'Drink around meals and activity', 'Increase gradually in heat or long exercise']),
  },
  {
    id: 'too-much-water', category: 'Hydration', phrases: ['too much water', 'water dangerous', 'overhydration'],
    ...response('Yes. Drinking extreme amounts quickly can dangerously dilute blood sodium. Avoid forcing large volumes; spread fluids through the day. Confusion, severe headache, vomiting, or seizures after excessive intake require urgent medical care.', ['Drink steadily rather than rapidly', 'Let thirst and conditions guide you', 'Seek care for severe symptoms']),
  },
  {
    id: 'water-workout', category: 'Hydration', phrases: ['water during workout', 'drink during workout', 'hydration during workout'],
    ...response('Sip water during workouts, especially when sessions are long, hot, or sweaty. Most shorter sessions need water rather than a special drink. Avoid waiting until you feel extremely thirsty.', ['Start reasonably hydrated', 'Keep a bottle nearby', 'Replace fluids gradually afterward']),
  },
  {
    id: 'coconut-water', category: 'Hydration', phrases: ['coconut water'],
    ...response('Coconut water provides fluid, carbohydrate, and potassium, but it is not essential for hydration. Plain water is usually sufficient for ordinary activity, and coconut water still contributes sugar and calories.', ['Use water as your default', 'Check serving size and label', 'Choose coconut water for preference, not necessity']),
  },
  {
    id: 'dehydration-signs', category: 'Hydration', phrases: ['signs of dehydration', 'dehydrated', 'dehydration symptoms'],
    ...response('Common signs can include thirst, dry mouth, darker urine, headache, tiredness, or dizziness. Severe confusion, fainting, inability to keep fluids down, or very little urine needs prompt medical assessment.', ['Pause activity and move somewhere cool', 'Sip fluids gradually', 'Get medical help for severe or worsening signs']),
  },
  {
    id: 'electrolytes', category: 'Hydration', phrases: ['electrolyte drink', 'electrolytes'],
    ...response('Most short, moderate workouts do not require electrolyte drinks. They may be useful during prolonged heavy sweating, long endurance activity, or significant heat exposure. Medical conditions can change electrolyte needs.', ['Use water for routine sessions', 'Consider duration, heat, and sweat loss', 'Ask a clinician if you have fluid restrictions']),
  },
  {
    id: 'muscle-soreness', category: 'Recovery', phrases: ['muscles sore', 'muscle soreness', 'why am i sore', 'doms'],
    ...response('Mild, widespread muscle soreness that appears after unfamiliar exercise is common and often settles over several days. Sharp, sudden, worsening, highly localized pain, major swelling, or loss of function is not typical soreness and should be assessed.', ['Use gentle movement and normal daily activity', 'Reduce the next session if movement is limited', 'Seek care for sharp pain or major swelling']),
  },
  {
    id: 'train-sore', category: 'Recovery', phrases: ['train while sore', 'workout while sore', 'exercise when sore'],
    ...response('With mild muscle soreness, light movement or training a different area may be reasonable. Avoid hard loading when soreness changes your technique. Do not train through sharp pain, joint pain, major swelling, weakness, or limited movement.', ['Rate soreness before warming up', 'Choose light activity or another muscle group', 'Stop if pain sharpens or movement worsens']),
  },
  {
    id: 'sleep', category: 'Recovery', phrases: ['how much sleep', 'sleep do i need', 'hours of sleep'],
    ...response('Most adults generally need at least 7 hours of sleep, and many feel best around 7–9 hours. Training load, age, and individual needs differ; consistent sleep and daytime function matter.', ['Set a consistent wake time', 'Create a short wind-down routine', 'Reduce training load if recovery stays poor']),
  },
  {
    id: 'rest-day', category: 'Recovery', phrases: ['rest day', 'day off workout'],
    ...response('A rest day can include normal movement, an easy walk, gentle mobility, good meals, fluids, and sleep. It does not need to be completely inactive unless you feel unwell or injured.', ['Take an easy walk if comfortable', 'Prepare food and water for tomorrow', 'Review soreness before the next workout']),
  },
  {
    id: 'recover-faster', category: 'Recovery', phrases: ['recover faster', 'improve recovery', 'faster recovery'],
    ...response('Recovery is supported by enough sleep, balanced meals with protein, fluids, manageable training volume, and rest. More supplements or extreme methods rarely replace these basics.', ['Protect tonight’s sleep', 'Eat a balanced post-training meal', 'Reduce volume if performance keeps falling']),
  },
  {
    id: 'stretch-after', category: 'Recovery', phrases: ['stretch after', 'stretching after'],
    ...response('Gentle stretching after training may help you relax and maintain flexibility, but it is not required to prevent soreness. Avoid forcing painful ranges or stretching an injured area.', ['Choose 2–3 comfortable stretches', 'Hold without bouncing or pain', 'Use gradual strength work for long-term mobility']),
  },
  {
    id: 'joint-pain', category: 'Recovery', phrases: ['joint pain', 'pain in joint', 'knee pain', 'shoulder pain'],
    ...response('Joint pain is different from ordinary muscle fatigue. Stop the movement that causes it and do not force through sharp or worsening pain. A qualified healthcare professional can assess persistent pain, swelling, instability, or reduced function.', ['Stop the painful exercise', 'Note the movement and symptoms', 'Seek professional assessment if it persists or is severe']),
  },
  {
    id: 'beginner-start', category: 'Beginner Guidance', phrases: ['i am a beginner', 'joined the gym', 'start working out', 'new to gym'],
    ...response('Welcome—your first goal is to learn a few movements and build a repeatable routine. Start with 2–3 full-body sessions weekly, light loads, and simple exercises rather than trying everything at once.', ['Choose two training days', 'Learn 4–6 basic movements', 'Record weights without comparing yourself to others'], ['/workout', '/workout/exercises']),
  },
  {
    id: 'first-week', category: 'Beginner Guidance', phrases: ['first week', 'week one gym'],
    ...response('In your first week, learn the gym layout, practice basic push, pull, squat, hinge, and core patterns, and finish each session feeling you could do a little more. Two or three short sessions are enough.', ['Tour the equipment and safety settings', 'Practice with easy loads', 'Leave at least one rest day between sessions'], ['/workout/exercises']),
  },
  {
    id: 'gym-nerves', category: 'Beginner Guidance', phrases: ['nervous in the gym', 'gym anxiety', 'scared of gym'],
    ...response('Feeling nervous in a new gym is common. Visit during a quieter time, carry a short written plan, and ask staff how to adjust equipment. Most people are focused on their own session.', ['Save a four-exercise plan', 'Arrive for a short familiarization visit', 'Ask staff one equipment question']),
  },
  {
    id: 'beginner-weight', category: 'Beginner Guidance', phrases: ['how much weight', 'weight should i lift', 'starting weight'],
    ...response('Start with a load you can control for every repetition while keeping several good repetitions in reserve. If technique changes, reduce the load. The correct starting weight differs by exercise and person.', ['Practice one light warm-up set', 'Choose a load that feels controlled', 'Add the smallest increment after consistent form']),
  },
  {
    id: 'machines-free-weights', category: 'Beginner Guidance', phrases: ['machines or free weights', 'free weights or machines'],
    ...response('Both can work. Machines can make setup and movement simpler; free weights can develop coordination and offer more movement choices. Beginners can use either or combine them based on comfort and instruction.', ['Learn two machines safely', 'Practice one simple free-weight movement', 'Use the option that allows control']),
  },
  {
    id: 'bmi-meaning', category: 'BMI', phrases: ['what is bmi', 'bmi mean', 'body mass index'],
    ...response(`BMI relates weight to height and is commonly used to screen weight categories in populations. ${BMI_DISCLAIMER}`, ['Use Body Check for a quick estimate', 'Treat the result as one data point', 'Discuss personal risk with a healthcare professional']),
  },
  {
    id: 'bmi-accuracy', category: 'BMI', phrases: ['bmi accurate', 'bmi useful', 'bmi high', 'bmi measure body fat', 'muscular people', 'muscular person'],
    ...response(`BMI can be useful for broad screening, but a high value does not explain its cause and can misclassify muscular people. ${BMI_DISCLAIMER}`, ['Consider waist, habits, fitness, and health history too', 'Avoid diagnosing yourself from BMI alone', 'Ask a qualified professional for individual interpretation']),
  },
]
