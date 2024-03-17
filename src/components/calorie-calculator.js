import { useState } from "react";
import LoadingSpinner from "@/components/spinner";
import {AlertModal} from "@/components/model/alert";

export const CalorieCalculatorPage = () => {
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
                setUploadedImage(base64Image); // 使用Base64编码的图片更新状态
                sendImageToServer(base64Image); // 发送Base64编码的图片到服务器
            } catch (error) {
                console.error('Error reading file:', error);
            }
        }
    };

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result); // 成功解析文件时解决Promise
            reader.onerror = error => reject(error); // 文件读取失败时拒绝Promise
            reader.readAsDataURL(file); // 以Base64格式读取文件
        });
    };

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

    const closeAlertModal = () => setShowAlert(false);


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
    // 示例FAQ数据，根据需要添加更多
    const faqs = [
        {
            question: "How does the Calorie Calculator work?",
            answer: "Our Calorie Calculator uses advanced AI algorithms to analyze the food in your uploaded images and estimate the total calorie count.",
        },
        {
            question: "Is this service free to use?",
            answer: "Yes, our Calorie Calculator is completely free to use for your dietary management and planning.",
        },
        // 添加更多FAQs
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
