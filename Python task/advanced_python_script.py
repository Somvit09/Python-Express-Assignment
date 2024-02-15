from cryptography.fernet import Fernet
import csv
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

# Generate a key for encryption and decryption
# You should save this key securely. If you lose it, you won't be able to decrypt the data.
key = Fernet.generate_key()
cipher_suite = Fernet(key)

def encrypt_data(input_file, output_file):
    try:
        with open(input_file, newline='') as csvfile, open(output_file, 'w', newline='') as encryptedfile:
            reader = csv.DictReader(csvfile)
            fieldnames = reader.fieldnames
            writer = csv.DictWriter(encryptedfile, fieldnames=fieldnames)
            writer.writeheader()
            
            for row in reader:
                # Encrypting the 'Salary' and 'Contact' fields
                row['Salary'] = cipher_suite.encrypt(row['Salary'].encode()).decode()
                row['Contact'] = cipher_suite.encrypt(row['Contact'].encode()).decode()
                writer.writerow(row)
        print("Encryption completed successfully.")
    except FileNotFoundError:
        print(f"The input file: {input_file} is not found.")  
    except Exception as e:
        print(f"An error occured during handling Encryption: {e}")    

def decrypt_data(input_file, output_file):
    try:
        with open(input_file, newline='') as encryptedfile, open(output_file, 'w', newline='') as decryptedfile:
            reader = csv.DictReader(encryptedfile)
            fieldnames = reader.fieldnames
            writer = csv.DictWriter(decryptedfile, fieldnames=fieldnames)
            writer.writeheader()
            
            for row in reader:
                # Decrypting the 'Salary' and 'Contact' fields
                row['Salary'] = cipher_suite.decrypt(row['Salary'].encode()).decode()
                row['Contact'] = cipher_suite.decrypt(row['Contact'].encode()).decode()
                writer.writerow(row)
        print("Decryption completed successfully.")
    except FileNotFoundError:
        print(f"The input file: {input_file} is not found.")  
    except Exception as e:
        print(f"An error occured during handling Decryption: {e}")   

# encryption and decryption
encrypt_data('data.csv', 'encrypted_data.csv')
decrypt_data('encrypted_data.csv', 'decrypted_data.csv')

# Keep this key safe for decryption purposes
print(f"Encryption key: {key.decode()}")

# Data Analysis of the decrypted csv file

# Trend Analysis

# We analyze how average salaries have changed over time. 

def trend_analysis(csvFile):
    try:
        # Load the dataset
        df = pd.read_csv(csvFile)

        # remove the $ from salary and convert salaries to float
        df['Salary'] = df['Salary'].replace('[\$,]', '', regex=True).astype(float)
        df['Year'] = pd.to_numeric(df['Year'], errors='coerce')


        # Group by 'Year' and calculate the average salary for each year
        average_salary_per_year = df.groupby('Year')['Salary'].mean()

        # Plotting
        plt.figure(figsize=(10, 6))
        average_salary_per_year.plot(kind='line', marker='o')
        plt.title('Average Salary Trend Over Years')
        plt.xlabel('Year')
        plt.ylabel('Average Salary')
        plt.grid(True)
        plt.show()
    except FileNotFoundError:
        print(f"File not found: {csvFile}. Some problems might occur during decryption.")
    except Exception as e:
        print(f"error: {e}")
    finally:
        print("Trend Analysis completed.")
    
trend_analysis("decrypted_data.csv")

#  Outlier Detection using Z-score
'''
To detect outliers in the salary data, we can use the Z-score method. A Z-score represents how 
many standard deviations an element is from the mean. A common threshold for identifying an outlier 
is a Z-score of greater than 3 or less than -3 (indicating it is more than 3 standard deviations 
away from the mean).
'''
def detect_outliers(csvFile):
    try:
        # Load the dataset
        df = pd.read_csv(csvFile)

        # Clean the 'Salary' column by removing '$' then converting to float
        df['Salary'] = df['Salary'].replace('[\$,]', '', regex=True).astype(float)

        # Calculate the Z-score for each salary
        df['Salary_Zscore'] = np.abs(stats.zscore(df['Salary']))

        # Identify outliers based on Z-score (e.g., Z > 3 or Z < -3)
        outliers = df[df['Salary_Zscore'] > 3]

        if not outliers.empty:
            print("Detected outliers based on Salary:")
            print(outliers[['id', 'Full Name', 'Salary', 'Salary_Zscore']])
        else:
            print("No significant outliers detected based on Salary.")
    
    except FileNotFoundError:
        print(f"File not found: {csvFile}. Please check the file path.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        print("Outlier detection process completed.")


detect_outliers("decrypted_data.csv")


