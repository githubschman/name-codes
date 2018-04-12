import firebase from 'firebase';
import { FIREBASE_CONFIG } from '../config';
import { createGameState } from '../actions/firebase_actions';

export const firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
export const firebaseAuth = firebaseApp.auth();
export const firebaseDb = firebaseApp.database();
const wordsArr = ["Ace", "Africa", "Agent", "Air", "Alaska", "Alien", "Alps", "Amazon", "Ambulance", "America", "Anchor", "Angel", "Ant", "Antarctica", "Anthem", "Apple", "Apron", "Arm", "Armor", "Army", "Ash", "Astronaut", "Atlantis", "Attic", "Australia", "Avalanche", "Axe", "Aztec", "Baby", "Back", "Bacon", "Ball", "Balloon", "Banana", "Band", "Bank", "Bar", "Barbecue", "Bark", "Bass", "Bat", "Bath", "Battery", "Battle", "Battleship", "Bay", "Beach", "Beam", "Bean", "Bear", "Beard", "Beat", "Bed", "Bee", "Beer", "Beijing", "Bell", "Belt", "Bench", "Berlin", "Bermuda", "Berry", "Bicycle", "Big Bang", "Big Ben", "Bikini", "Bill", "Biscuit", "Blacksmith", "Blade", "Blind", "Blizzard", "Block", "Blues", "Board", "Boil", "Bolt", "Bomb", "Bond", "Bonsai", "Book", "Boom", "Boot", "Boss", "Bottle", "Bow", "Bowl", "Bowler", "Box", "Boxer", "Brain", "Brass", "Brazil", "Bread", "Break", "Brick", "Bride", "Bridge", "Brother", "Brush", "Bubble", "Buck", "Bucket", "Buffalo", "Bug", "Bugle", "Bulb", "Bunk", "Butter", "Butterfly", "Button", "Cable", "Caesar", "Cake", "Calf", "Camp", "Canada", "Cane", "Cap", "Capital", "Captain", "Car", "Card", "Carrot", "Casino", "Cast", "Castle", "Cat", "Cave", "Cell", "Centaur", "Center", "Chain", "Chair", "Chalk", "Change", "Charge", "Check", "Cheese", "Cherry", "Chest", "Chick", "China", "Chip", "Chocolate", "Christmas", "Church", "Circle", "Cleopatra", "Cliff", "Cloak", "Clock", "Cloud", "Club", "Coach", "Coast", "Code", "Coffee", "Cold", "Collar", "Columbus", "Comb", "Comet", "Comic", "Compound", "Computer", "Concert", "Conductor", "Cone", "Contract", "Cook", "Copper", "Cotton", "Country", "Court", "Cover", "Cow", "Cowboy", "Crab", "Craft", "Crane", "Crash", "Cricket", "Cross", "Crow", "Crown", "Crusader", "Crystal", "Cuckoo", "Curry", "Cycle", "Czech", "Dance", "Dash", "Date", "Day", "Death", "Deck", "Degree", "Delta", "Dentist", "Desk", "Diamond", "Dice", "Dinosaur", "Director", "Disease", "Disk", "Doctor", "Dog", "Doll", "Dollar", "Door", "Draft", "Dragon", "Drawing", "Dream", "Dress", "Dressing", "Drill", "Driver", "Drone", "Drop", "Drum", "Dryer", "Duck", "Dust", "Dwarf", "Dwarf", "Eagle", "Ear", "Earth", "Earthquake", "Easter", "Eden", "Egg", "Egypt", "Einstein", "Elephant", "Embassy", "Engine", "England", "Europe", "Eye", "Face", "Fair", "Fall", "Fan", "Farm", "Fence", "Fever", "Fiddle", "Field", "Fighter", "Figure", "File", "Film", "Fire", "Fish", "Flag", "Flat", "Flood", "Floor", "Flute", "Fly", "Foam", "Fog", "Foot", "Force", "Forest", "Fork", "France", "Frog", "Frost", "Fuel", "Game", "Gangster", "Garden", "Gas", "Gear", "Genie", "Genius", "Germany", "Ghost", "Giant", "Glacier", "Glass", "Glasses", "Glove", "Goat", "Gold", "Goldilocks", "Golf", "Governor", "Grace", "Grass", "Greece", "Green", "Greenhouse", "Groom", "Ground", "Guitar", "Gum", "Gymnast", "Hair", "Halloween", "Ham", "Hamburger", "Hammer", "Hand", "Hawaii", "Hawk", "Head", "Heart", "Helicopter", "Helmet", "Hercules", "Hide", "Himalayas", "Hit", "Hole", "Hollywood", "Homer", "Honey", "Hood", "Hook", "Horn", "Horse", "Horseshoe", "Hose", "Hospital", "Hotel", "House", "Ice", "Ice Age", "Ice Cream", "Iceland", "Igloo", "India", "Ink", "Iron", "Ivory", "Jack", "Jail", "Jam", "Jellyfish", "Jet", "Jeweler", "Joan of Arc", "Jockey", "Joker", "Judge", "Jumper", "Jupiter", "Kangaroo", "Ketchup", "Key", "Kick", "Kid", "Kilt", "King", "King Arthur", "Kiss", "Kitchen", "Kiwi", "Knife", "Knight", "Knot", "Kung Fu", "Lab", "Lace", "Ladder", "Lap", "Laser", "Laundry", "Lawyer", "Lead", "Leaf", "Leather", "Lemon", "Lemonade", "Leprechaun", "Letter", "Life", "Light", "Lightning", "Limousine", "Line", "Link", "Lion", "Lip", "Litter", "Loch Ness", "Lock", "Locust", "Log", "London", "Love", "Luck", "Lumberjack", "Lunch", "Magazine", "Magician", "Mail", "Makeup", "Mammoth", "Manicure", "Map", "Maple", "Maracas", "Marathon", "Marble", "March", "Mark", "Mass", "Match", "Medic", "Memory", "Mercury", "Mess", "Meter", "Mexico", "Microscope", "Microwave", "Mile", "Milk", "Mill", "Millionaire", "Mine", "Minotaur", "Mint", "Minute", "Mirror", "Miss", "Missile", "Model", "Mohawk", "Mole", "Mona Lisa", "Monkey", "Moon", "Moscow", "Moses", "Mosquito", "Mother", "Mount", "Mountie", "Mouse", "Mouth", "Mud", "Mug", "Mummy", "Musketeer", "Mustard", "Nail", "Napoleon", "Needle", "Nerve", "Net", "New York", "Newton", "Night", "Ninja", "Noah", "Nose", "Note", "Notre Dame", "Novel", "Nurse", "Nut", "Nylon", "Oasis", "Octopus", "Oil", "Olive", "Olympus", "Onion", "Opera", "Orange", "Organ", "Pacific", "Pad", "Paddle", "Page", "Paint", "Palm", "Pan", "Pants", "Paper", "Parachute", "Parade", "Park", "Parrot", "Part", "Pass", "Paste", "Patient", "Pea", "Peach", "Peanut", "Pearl", "Pen", "Penguin", "Penny", "Pentagon", "Pepper", "Pew", "Pheonix", "Piano", "Pie", "Pig", "Pillow", "Pilot", "Pin", "Pine", "Pipe", "Pirate", "Pistol", "Pit", "Pitch", "Pitcher", "Pizza", "Plane", "Plastic", "Plate", "Platypus", "Play", "Plot", "Pocket", "Point", "Poison", "Pole", "Police", "Polish", "Polo", "Pool", "Pop", "Popcorn", "Port", "Post", "Potato", "Potter", "Pound", "Powder", "Press", "Princess", "Pumpkin", "Pupil", "Puppet", "Purse", "Pyramid", "Quack", "Quarter", "Queen", "Rabbit", "Racket", "Radio", "Rail", "Rainbow", "Ram", "Ranch", "Rat", "Ray", "Razor", "Record", "Reindeer", "Revolution", "Rice", "Rifle", "Ring", "Rip", "River", "Road", "Robin", "Robot", "Rock", "Rodeo", "Roll", "Rome", "Root", "Rope", "Rose", "Roulette", "Round", "Row", "Rubber", "Ruler", "Russia", "Rust", "Sack", "Saddle", "Sahara", "Sail", "Salad", "Saloon", "Salsa", "Salt", "Sand", "Santa", "Satellite", "Saturn", "Saw", "Scale", "Scarecrow", "School", "Scientist", "Scorpion", "Scratch", "Screen", "Scroll", "Scuba Diver", "Seal", "Second", "Server", "Shadow", "Shakespeare", "Shampoo", "Shark", "Shed", "Sheet", "Shell", "Sherlock", "Sherwood", "Ship", "Shoe", "Shoot", "Shop", "Shorts", "Shot", "Shoulder", "Shower", "Sign", "Silk", "Sink", "Sister", "Skates", "Ski", "Skull", "Skyscraper", "Sled", "Sleep", "Sling", "Slip", "Slipper", "Sloth", "Slug", "Smell", "Smoke", "Smoothie", "Smuggler", "Snake", "Snap", "Snow", "Snowman", "Soap", "Sock", "Soldier", "Soul", "Sound", "Soup", "Space", "Spell", "Sphinx", "Spider", "Spike", "Spine", "Spirit", "Spoon", "Spot", "Spray", "Spring", "Spurs", "Spy", "Square", "Squash", "Squirrel", "St.Patrick", "Stable", "Stadium", "Staff", "Stamp", "Star", "State", "Steam", "Steel", "Step", "Stethoscope", "Stick", "Sticker", "Stock", "Storm", "Story", "Straw", "Stream", "Street", "Strike", "String", "Sub", "Sugar", "Suit", "Sumo", "Sun", "Superhero", "Swamp", "Sweat", "Swing", "Switch", "Sword", "Table", "Tablet", "Tag", "Tail", "Tank", "Tap", "Taste", "Tattoo", "Tea", "Teacher", "Team", "Tear", "Telescope", "Temple", "Texas", "Theater", "Thief", "Thumb", "Thunder", "Tick", "Tie", "Tiger", "Time", "Tin", "Tip", "Tipi", "Toast", "Tokyo", "Tooth", "Torch", "Tornado", "Tower", "Track", "Train", "Triangle", "Trick", "Trip", "Troll", "Trunk", "Tube", "Tunnel", "Turkey", "Turtle", "Tutu", "Tuxedo", "Undertaker", "Unicorn", "Univerity", "Vacuum", "Valentine", "Vampire", "Van", "Venus", "Vet", "Viking", "Violet", "Virus", "Volcano", "Volume", "Wagon", "Waitress", "Wake", "Wall", "Walrus", "War", "Washer", "Washington", "Watch", "Water", "Wave", "Web", "Wedding", "Well", "Werewolf", "Whale", "Wheel", "Wheelchair", "Whip", "Whistle", "Wind", "Window", "Wing", "Wish", "Witch", "Wizard", "Wonderland", "Wood", "Wool", "Worm", "Yard", "Yellowstone", "Zombie"]
const twentyFiveWords = () => {
    let words = [];
    while(words.length < 25) {
        let index = Math.floor(Math.random() * wordsArr.length);
        if (!words.includes(wordsArr[index])) {
            words.push(wordsArr[index]);
        }
    }
    return words;
}

const createGameSpots = () =>{
    let spots = {red: [], blue: [], dead: []};
    while(spots.dead.length < 1) {
        let num = Math.floor(Math.random() * 25);
        spots.dead.push(num);
    }
    while(spots.red.length < 8) {
        let num = Math.floor(Math.random() * 25);
        if (!spots.dead.includes(num)) {
            spots.red.push(num);
        }
    }
    while(spots.blue.length < 8) {
        let num = Math.floor(Math.random() * 25);
        if (!spots.red.includes(num) && !spots.dead.includes(num)) {
            spots.blue.push(num);
        }
    }
    return spots;
}

const blankMoves = () => {
    let i = 0;
    let arr = [];
    while (i < 25) {
        arr.push(false);
        i++;
    }
    return arr;
}

const spaceClasses = (spots) => {
    let i = 0;
    let arr = [];
    let blue = spots.blue;
    let red = spots.red;
    let dead = spots.dead;
    while (i < 25) {
        if (red.includes(i)) {
            arr.push('red-spot');
        } else if (blue.includes(i)) {
            arr.push('blue-spot');
        } else if (dead.includes(i)) {
            arr.push('dead-spot');
        } else {
            arr.push('civ-spot');
        }
        i++;
    }
    return arr;
}

const FireBaseTools = {

    startNewGame: (room, player, team) => {
        // add player to gameroom
        // if they're the first person on their team, they are the clue-giver
        let redArr = [];
        let blueArr = [];

        return firebaseApp.database().ref(`games/${room}`).once('value')
            .then(snapshot => snapshot.val())
            .then(gameRoom => {
                if (team === 'red') {
                    redArr.push(player);
                } else {
                    blueArr.push(player);
                }
                if (!gameRoom) {
                    // room doesnt exist
                    let spots = createGameSpots();
                    firebaseApp.database().ref(`games/${room}`).set({
                        'red': redArr,
                        'blue': blueArr,
                        'words': twentyFiveWords(),
                        'redSpots': spots.red,
                        'blueSpots': spots.blue,
                        'deadSpot': spots.dead,
                        'spaceClasses': spaceClasses(spots),
                        'moves': blankMoves()
                    });
                } else {
                    // room exists
                    firebase.database().ref(`games/${room}`).update({
                        'red': gameRoom.red ? [...gameRoom.red, ...redArr] : redArr,
                        'blue': gameRoom.blue ? [...gameRoom.blue, ...blueArr] : blueArr,
                    });
                }
            });
    },
    /**
     * Get the firebase database reference.
     *
     * @param path {!string|string}
     * @returns {!firebase.database.Reference|firebase.database.Reference}
     */
    getDatabaseReference: path => firebaseDb.ref(path),
};

export default FireBaseTools;
