import React from "react";
import Button from "react-bootstrap/Button";
import styles from "../styles/modules/Button.module.css";

const TestToolSignUp = ({ onGenerateTestUser }) => {

  const generateTestUser = () => {
    // Generate a unique username with timestamp
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const testUsername = `testuser${timestamp}${randomSuffix}`;
    
    const testUserData = {
      username: testUsername,
      password1: "Qwerqwer1*",
      password2: "Qwerqwer1*"
    };

    // Call the parent's function to fill the form
    onGenerateTestUser(testUserData);
  };

  return (
    <div style={{ 
      marginBottom: '15px', 
      padding: '10px', 
      backgroundColor: '#f8f9fa', 
      border: '1px dashed #dee2e6',
      borderRadius: '5px',
      textAlign: 'center'
    }}>
      <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#6c757d' }}>
        🛠️ Development Tool
      </p>
      <Button
        className={`${styles.Button} ${styles.Blue}`}
        onClick={generateTestUser}
        size="sm"
      >
        🎲 Generate Test User
      </Button>
      <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#6c757d' }}>
        Creates random username with password: Qwerqwer1*
      </p>
    </div>
  );
};

export default TestToolSignUp; 