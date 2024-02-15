import unittest
import pandas as pd
import numpy as np
from io import StringIO
import io
import mock
from advanced_python_script import encrypt_data, decrypt_data, trend_analysis, detect_outliers

class TestYourScript(unittest.TestCase):

    def test_encrypt_decrypt(self):
        
        input_file = 'data.csv'
        encrypted_file = 'temp_encrypted.csv'
        decrypted_file = 'temp_decrypted.csv'

        # Encrypt the data
        encrypt_data(input_file, encrypted_file)

        # Decrypt the data
        decrypt_data(encrypted_file, decrypted_file)

        # Read the original and decrypted files
        df_original = pd.read_csv(input_file)
        df_decrypted = pd.read_csv(decrypted_file)

        # Assert that the original and decrypted DataFrames are equal
        pd.testing.assert_frame_equal(df_original, df_decrypted)

    def test_trend_analysis(self):
        # Prepare a temporary file to simulate the decrypted CSV
        decrypted_file = 'temp_decrypted.csv'

        # Run trend analysis (capture print output)
        with mock.patch('sys.stdout', new_callable=io.StringIO) as mock_stdout:
            trend_analysis(decrypted_file)

        # Assert that the expected output is in the printed output
        expected_output = "Trend Analysis completed."
        self.assertIn(expected_output, mock_stdout.getvalue())

    def test_detect_outliers(self):
        # Prepare a temporary file to simulate the decrypted CSV
        decrypted_file = 'temp_decrypted.csv'

        # Run outlier detection (capture print output)
        with mock.patch('sys.stdout', new_callable=io.StringIO) as mock_stdout:
            detect_outliers(decrypted_file)

        # Assert that the expected output is in the printed output
        expected_output = "Outlier detection process completed."
        self.assertIn(expected_output, mock_stdout.getvalue())

if __name__ == '__main__':
    unittest.main()
