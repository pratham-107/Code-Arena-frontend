import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import {
  HelpOutline,
  ContactSupport,
  Feedback,
  ReportProblem,
  ExpandMore,
  Email,
  Phone,
  Chat,
  LiveHelp,
  BugReport,
  Description,
  EmojiEvents,
  Groups,
} from "@mui/icons-material";

const Support = () => {
  const [expanded, setExpanded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  // Support data
  const supportTopics = [
    {
      id: "account",
      title: "Account Issues",
      icon: <ContactSupport />,
      content: "Having trouble with your account? Forgot your password? Need to update your profile information? Our account support team can help you with login issues, password resets, and profile management.",
    },
    {
      id: "technical",
      title: "Technical Problems",
      icon: <BugReport />,
      content: "Experiencing technical issues with the platform? Problems with the code editor, contest participation, or problem submissions? Our technical team is here to help resolve any bugs or glitches you encounter.",
    },
    {
      id: "billing",
      title: "Billing & Payments",
      icon: <Description />,
      content: "Questions about subscriptions, payments, or billing issues? Our billing team can assist with payment methods, subscription management, refunds, and invoice requests.",
    },
    {
      id: "feedback",
      title: "Feedback & Suggestions",
      icon: <Feedback />,
      content: "We value your feedback! Have ideas for new features or improvements to existing ones? Want to report a bug or suggest enhancements? Share your thoughts with our product team.",
    },
    {
      id: "contests",
      title: "Contest Support",
      icon: <EmojiEvents />,
      content: "Need help with contest registration, participation, or results? Our contest support team can assist with scheduling, rules, rankings, and any issues that arise during competitions.",
    },
    {
      id: "community",
      title: "Community Guidelines",
      icon: <Groups />,
      content: "Questions about community rules, reporting inappropriate content, or understanding our code of conduct? Our community team ensures a safe and welcoming environment for all users.",
    },
  ];

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Click on the 'Login' button and then select 'Forgot Password'. Enter your email address and follow the instructions sent to your inbox.",
    },
    {
      question: "How long does it take to get a response?",
      answer: "Our support team typically responds within 24 hours. For urgent issues, you may receive a response sooner.",
    },
    {
      question: "Can I get a refund for my subscription?",
      answer: "Yes, we offer refunds within 14 days of purchase. Please contact our billing team with your request and order details.",
    },
    {
      question: "How do I report inappropriate content?",
      answer: "You can report inappropriate content using the report button on any post or comment. Our community team will review and take appropriate action.",
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        py: 4,
        minHeight: "calc(100vh - 200px)",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              color: "primary.main",
            }}
          >
            Support Center
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 700,
              mx: "auto",
            }}
          >
            Get help with any questions or issues you have with CodeArena
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Support Options */}
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 4, backgroundColor: "background.paper" }}>
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <HelpOutline /> How Can We Help?
                </Typography>

                <Grid container spacing={2}>
                  {supportTopics.map((topic) => (
                    <Grid item xs={12} key={topic.id}>
                      <Card
                        sx={{
                          height: "100%",
                          backgroundColor: "rgba(0, 0, 0, 0.02)",
                          border: "1px solid rgba(0, 0, 0, 0.05)",
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                            borderColor: "primary.main",
                          },
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                            <Box sx={{ color: "primary.main", mt: 0.5 }}>
                              {topic.icon}
                            </Box>
                            <Box>
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}
                              >
                                {topic.title}
                              </Typography>
                              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                {topic.content}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Form and FAQ */}
          <Grid item xs={12} md={6}>
            {/* Contact Form */}
            <Card sx={{ mb: 4, backgroundColor: "background.paper" }}>
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Email /> Contact Us
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message"
                        name="message"
                        multiline
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{ py: 1.5 }}
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card sx={{ backgroundColor: "background.paper" }}>
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <LiveHelp /> Frequently Asked Questions
                </Typography>

                {faqs.map((faq, index) => (
                  <Accordion
                    key={index}
                    expanded={expanded === `panel${index}`}
                    onChange={handleAccordionChange(`panel${index}`)}
                    sx={{ mb: 1 }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      sx={{ 
                        "&:hover": { 
                          backgroundColor: "rgba(0, 0, 0, 0.02)" 
                        } 
                      }}
                    >
                      <Typography sx={{ fontWeight: 600 }}>
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography sx={{ color: "text.secondary" }}>
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Contact Information */}
        <Card sx={{ mt: 4, backgroundColor: "background.paper" }}>
          <CardContent>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: "primary.main",
                textAlign: "center",
              }}
            >
              Other Ways to Get Help
            </Typography>

            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <Email sx={{ color: "white", fontSize: 30 }} />
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Email Support
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    support@codearena.com
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Response within 24 hours
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <Chat sx={{ color: "white", fontSize: 30 }} />
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Live Chat
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Available Mon-Fri, 9AM-5PM EST
                  </Typography>
                  <Chip label="Online Now" color="success" size="small" sx={{ mt: 1 }} />
                </Box>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <Phone sx={{ color: "white", fontSize: 30 }} />
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Phone Support
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    +1 (555) 123-4567
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Mon-Fri, 9AM-5PM EST
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Support;