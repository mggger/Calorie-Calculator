import { useState } from "react";
import LoadingSpinner from "@/components/spinner";
import {AlertModal} from "@/components/model/alert";

// Defines the main component for the calorie calculator page
export const CalorieCalculatorPage = () => {
    // State hooks for managing various states
    const [uploadedImage, setUploadedImage] = useState(null);
    const [foodItems, setFoodItems] = useState([]);
    const [totalCalories, setTotalCalories] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');


    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const base64Image = await getBase64(file);
                setUploadedImage(base64Image); // Updates state with the base64 encoded image
                sendImageToServer(base64Image); // Sends the base64 encoded image to the server
            } catch (error) {
                console.error('Error reading file:', error);
            }
        }
    };

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result); // Resolves the promise upon successful file read
            reader.onerror = error => reject(error); // Rejects the promise if file reading fails
            reader.readAsDataURL(file); // Reads the file as a base64 data URL
        });
    };

    // Component for uploading images
    const ImageUpload = ({ onUpload, uploadedImage }) => {
        return (
            <div className="text-center p-4">
                <input id="upload" type="file" accept="image/*" onChange={onUpload} className="hidden" />
                <div className="image-container h-[380px] md:h-[200px] lg:h-[380px] w-full bg-white rounded-lg overflow-hidden">
                    {uploadedImage && <img src={uploadedImage} alt="Uploaded Food" className="w-full h-full object-cover" />}
                </div>
            </div>
        );
    };

    // Sends the base64 encoded image to the server for processing
    const sendImageToServer = (base64Image) => {
        setLoading(true);
        fetch('/api/detect_food', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64Image }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setFoodItems(data.items);
                    setTotalCalories(data.count);
                } else {
                    setShowAlert(true);
                    setAlertMessage(data.message);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                // Show AlertModal on error
                setLoading(false);
                setShowAlert(true);
                setAlertMessage('Failed to analyze the image. Please try again.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Closes the alert modal
    const closeAlertModal = () => setShowAlert(false);

    // Component displaying the result of food detection
    const FoodDetection = () => {
        if (foodItems.length === 0) {
            return <div className="md:flex-1 h-auto flex flex-col justify-between bg-base-100 rounded-box shadow">
                <h2 className="text-xl md:text-2xl font-bold text-center mb-4 text-gray-700 py-4">
                    Your food analysis report
                </h2>
            </div>;
        }

        return (
            <div className="md:flex-1 h-auto flex flex-col justify-between bg-base-100 rounded-box shadow">
                <div className="p-4">
                    <h2 className="text-xl md:text-2xl font-bold text-center mb-4 text-gray-700">Detected Food Items</h2>
                    <div className="flex flex-wrap gap-2 justify-center items-center">
                        {foodItems.map((item, index) => (
                            <span key={index} className="badge badge-primary badge-outline p-4 text-sm md:text-base">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="divider divider-horizontal"></div>
                <div className="py-4 px-4 text-center">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-700">Total Calories:</h3>
                    <p className="text-2xl font-bold text-blue-600">{totalCalories} cal</p>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-2">
            {isLoading && (
                <LoadingSpinner />
            )}
            <div className="alert alert-info bg-blue-100 shadow-lg max-w-4xl w-full mb-4">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>This is a Free Online Tool.Please note that we use Google Gemini AI, which has a limit of 2 requests per minute. If you encounter any errors, please try again.</span>
                </div>
            </div>

            <div className="container max-w-4xl p-5 bg-base-100 shadow-xl rounded-lg">
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">Calorie Calculator</h1>
                <label htmlFor="upload" className="btn btn-primary cursor-pointer mb-4">
                    Upload your food image
                </label>

                <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="flex-1">
                        <div className="image-upload-area border-2 border-dashed h-[380px] md:h-[200px] lg:h-[380px] border-gray-300 rounded-lg flex justify-center items-center relative text-center bg-white">
                            <ImageUpload onUpload={handleImageUpload} uploadedImage={uploadedImage} />
                            {!uploadedImage && (
                                <div className="absolute inset-0 flex flex-col justify-center items-center text-gray-500">
                                    <p>No image uploaded</p>
                                    <p className="mt-2">Your uploaded image will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>



                    <FoodDetection />
                </div>
            </div>

            <FAQSection />

            <AlertModal show={showAlert} onClose={closeAlertModal} type="error" message={alertMessage} />
        </div>
    );
};




const FAQSection = () => {
    const faqs = [
        {
            question: "How does the Calorie Calculator work?",
            answer: "Our Calorie Calculator uses advanced AI algorithms to analyze the food in your uploaded images and estimate the total calorie count.",
        },
        {
            question: "Is this service free to use?",
            answer: "Yes, our Calorie Calculator is completely free to use for your dietary management and planning.",
        },
        {
            question: "Can the One Sol Calorie Calculator identify and calculate calories in children's meals?",
            answer: "Absolutely! Our One Sol Calorie Calculator is designed with versatility in mind, including a specialized children's calorie calculator feature to help manage the dietary needs of younger users.",
        },
        {
            question: "How can I use the Losertown Calorie Calculator to plan my weight loss journey?",
            answer: "Our application integrates features similar to the Losertown Calorie Calculator, offering personalized weight loss projections based on your food intake and calorie burn, aiding in efficient planning.",
        },
        {
            question: "Is there a feature for athletes, similar to a Ruck Calorie Calculator?",
            answer: "Yes, our AI recognizes the unique needs of athletes and includes a Ruck Calorie Calculator function to estimate calories burned during high-intensity workouts and ruck marches.",
        },
        {
            question: "Can I calculate the calories burned in a sauna?",
            answer: "Indeed, our Sauna Calories Calculator feature estimates the calories burned during your sauna sessions, adding a unique aspect to your overall calorie management.",
        },
        {
            question: "How does the James Smith Calorie Calculator feature work?",
            answer: "Inspired by popular fitness methodologies, our tool offers insights similar to those you'd expect from a James Smith Calorie Calculator, focusing on realistic and sustainable dietary plans.",
        },
        {
            question: "Can I calculate calories in my smoothies?",
            answer: "Yes, with our Smoothie Calorie Calculator, you can easily determine the calorie content of various smoothie combinations to keep track of your liquid intake.",
        },
        {
            question: "How can parents use the Calorie Calculator Pediatric feature?",
            answer: "Our Calorie Calculator Pediatric feature is designed to help parents manage their children's diets by providing accurate calorie counts for a wide range of foods suitable for younger users.",
        },
        {
            question: "Does the calculator provide calorie estimates for poke bowls?",
            answer: "Absolutely! Our Poke Bowl Calorie Calculator allows you to upload images of your poke bowls to receive precise calorie counts, making it easier to enjoy your favorite dishes guilt-free.",
        },
        {
            question: "Can I find out the calories in my daily Starbucks drinks?",
            answer: "Certainly! Our Starbucks Calorie Calculator enables you to calculate the calories in your favorite Starbucks beverages, helping you make informed choices about your coffee consumption.",
        },
        {
            question: "Is there a feature for sushi calorie calculation?",
            answer: "Yes, our Sushi Calorie Calculator can accurately estimate the calorie content in various sushi rolls and dishes, supporting your healthy eating goals.",
        },
        {
            question: "How does the calculator handle acai bowls?",
            answer: "Our Acai Bowl Calories Calculator feature provides detailed calorie information for your acai bowl creations, from basic bowls to those with elaborate toppings.",
        },
        {
            question: "Can the calculator assist with diet planning for breastfeeding mothers?",
            answer: "Yes, understanding the unique needs of breastfeeding mothers, our application includes The Breastfeeding Mama Calorie Calculator feature, offering tailored dietary insights for nursing mothers."
        },
        {
            question: "Can I calculate calories in bubble tea?",
            answer: "Absolutely! Our Calorie Calculator can analyze images of bubble tea to provide you with an estimated calorie count, helping you make informed dietary choices.",
        },
        {
            question: "Is there a way to calculate calories burned during physical activities, like sex or ice baths?",
            answer: "While our primary focus is on food calorie estimation, incorporating features for calculating calories burned through various activities is something we're exploring for future updates.",
        },
        {
            question: "How do I calculate calories in Starbucks drinks?",
            answer: "Just upload a photo of your Starbucks drink, and our AI will estimate the calorie content. This includes custom drinks, coffee, and more.",
        },
        {
            question: "Does the calculator work for international calorie counting methods, like 'calculadora de calorias diarias'?",
            answer: "Yes, our calculator supports various dietary needs and counting methods globally, making it versatile for users worldwide.",
        },
        {
            question: "Can this tool help calculate calories for specific diets or needs, like pediatric or breastfeeding moms?",
            answer: "Our AI is designed to estimate calories in food images, which can assist in managing specific dietary needs, though it's recommended to consult healthcare professionals for personalized advice.",
        },
        {
            question: "How accurate is the calorie count for complex dishes, like poke bowls or acai bowls?",
            answer: "Our AI analyzes each component of complex dishes to provide an accurate calorie estimate, though actual values can vary based on ingredients and portion sizes.",
        },
        {
            question: "Can I use this calculator for dietary management in children?",
            answer: "Yes, the calculator can be a helpful tool for estimating calorie intake in children's meals, aiding in nutritional planning and management.",
        },
        {
            question: "How can I calculate calories in homemade smoothies or fruit smoothies?",
            answer: "Upload an image of your smoothie, and our AI will analyze the ingredients to estimate the total calorie count, aiding in your dietary management.",
        },
        {
            question: "Is it possible to calculate calories burned through activities like stair climbing?",
            answer: "Currently, our focus is on estimating calories in food. We're considering expanding to activities in the future to offer a comprehensive dietary and fitness tool.",
        },
        {
            question: "Can the calculator estimate calories in fast food chain items, like Dutch Bros or Bibibop?",
            answer: "Yes, simply upload an image of your meal from fast food chains, and our AI will provide an estimated calorie count to help with your dietary choices.",
        },
        {
            question: "Can the Calorie Calculator estimate calories in bubble tea?",
            answer: "Absolutely! Just upload a picture of your bubble tea, and our calculator will provide an estimated calorie count, helping you enjoy your drink mindfully.",
        },
        {
            question: "How does the calculator determine calories burned during physical activities like sex?",
            answer: "Our calculator estimates calories burned in various activities based on intensity and duration, ensuring you have a comprehensive view of your calorie balance.",
        },
        {
            question: "Is it possible to calculate calories in Starbucks drinks?",
            answer: "Yes, whether it's a custom Starbucks drink or a classic, our AI can analyze your drink images and estimate their calorie content.",
        },
        {
            question: "How accurate is the calorie count for cold exposures like ice baths?",
            answer: "While individual results may vary, our calculator provides an estimate of calories burned during cold exposures based on known averages and scientific research.",
        },
        {
            question: "Can I calculate the calories of fast food items under 500 calories?",
            answer: "Certainly! Upload an image of your fast food item, and our tool will help you identify options under 500 calories for healthier choices.",
        },
        {
            question: "How does the Calorie Calculator support children's dietary needs?",
            answer: "Our children's calorie calculator considers the unique nutritional needs of children, aiding in the management and planning of their healthy diets.",
        },
        {
            question: "Can I plan a 3500 calorie meal with this calculator?",
            answer: "Yes, our calculator can assist in meal planning by providing calorie estimates for various foods, helping you achieve specific dietary goals like a 3500 calorie meal plan.",
        },
        {
            question: "What is the concept of 'net calories' as calculated by the app?",
            answer: "Net calories represent the balance of calories consumed minus calories burned through activities. Our app provides insights into managing your calorie intake and expenditure effectively.",
        },
        {
            question: "How can I manage a 200 calorie deficit with the calculator?",
            answer: "By analyzing your food intake and physical activities, our calculator can guide you in maintaining a 200 calorie deficit for weight management or loss.",
        }
    ];

    return (
        <div className="mt-8">
            <div className="divider"></div>
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            {faqs.map((faq, index) => (
                <div key={index} className="collapse collapse-plus border border-base-300 bg-base-100 rounded-box mb-2">
                    <input type="checkbox" className="peer" />
                    <div className="collapse-title text-lg font-medium">
                        {faq.question}
                    </div>
                    <div className="collapse-content text-base">
                        <p>{faq.answer}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
