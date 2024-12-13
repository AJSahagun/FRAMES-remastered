import { FaArrowRight, FaShieldAlt, FaRegClock, FaUsers } from "react-icons/fa";

const LearnMore = () => {
  const benefits = [
    {
      icon: <FaShieldAlt className="w-8 h-8 text-primary" />,
      title: "Enhanced Security",
      description:
        "Our face recognition technology ensures your identity is protected and verified securely.",
    },
    {
      icon: <FaRegClock className="w-8 h-8 text-primary" />,
      title: "Quick Process",
      description:
        "Complete your registration in minutes with our streamlined four-step process.",
    },
    {
      icon: <FaUsers className="w-8 h-8 text-primary" />,
      title: "User-Friendly",
      description:
        "Designed for users of all tech levels with clear instructions and support.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Information Input",
      description: "Start by providing basic details to create your profile.",
    },
    {
      number: "02",
      title: "Face Registration",
      description:
        "Securely register your face using our advanced recognition system.",
    },
    {
      number: "03",
      title: "Verification",
      description: "Review your information to ensure everything is accurate.",
    },
    {
      number: "04",
      title: "Confirmation",
      description: "Complete your registration and gain immediate access.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-accent text-white py-20">
        <div className="container mx-auto px-4">
          <img
            className="mb-6 px-2 bg-white rounded-md"
            src="/logos/FRAMES_title-logo.png"
            alt="FRAMES logo"
          />
          <p className="text-xl mb-8 max-w-2xl font-noto_sans">
            Facial Recognition Access Management Enhanced System
          </p>
          <div className="flex gap-4">
            <a href="/register">
              <button className="bg-white text-tc px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
                Register Now
              </button>
            </a>
            {/* <button className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-300">
              Watch Demo
            </button> */}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How does it work?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Steps */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Registration Process
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <span className="text-4xl font-bold text-tc/20">
                    {step.number}
                  </span>
                  <h3 className="text-xl font-semibold mt-2 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <FaArrowRight className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-primary" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Common Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: "Is my face data secure?",
                a: "Yes, all facial data is encrypted and stored securely following industry best practices.",
              },
              {
                q: "What if I can't complete the registration?",
                a: "Our support team is available 24/7 to assist you with any registration issues.",
              },
              {
                q: "How long does registration take?",
                a: "The entire process typically takes less than 5 minutes to complete.",
              },
            ].map((faq, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-btnHover text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8">
            Access the library seamlessly with FRAMES.
          </p>
          <a href="/register">
            <button className="bg-white text-tc px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
              Register Now
            </button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default LearnMore;
